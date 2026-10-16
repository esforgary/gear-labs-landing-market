import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addProduct, addProducts, changeOrderStatus, checkout, createDemoState, deleteAllProducts,
  deleteProduct, parseProductImport, restoreDemoState, setCartQuantity,
} from './market-model.ts';

const details = { name: 'Демо покупатель', contact: '@demo', address: 'Самовывоз' };
const draft = { name: 'Новый товар', description: 'Описание', price: 199.99, stock: 5, imageUrl: 'demo:bag', color: '#abcdef' };

test('checkout snapshots products, reduces stock and clears cart without changing input', () => {
  const state = setCartQuantity(setCartQuantity(createDemoState(), 1, 2), 2, 1);
  const before = JSON.stringify(state);
  const next = checkout(state, details);
  assert.equal(JSON.stringify(state), before);
  assert.equal(next.products[0].stock, 10);
  assert.equal(next.products[1].stock, 7);
  assert.equal(next.orders[0].total, 2 * 7490 + 5990);
  assert.equal(next.orders[0].status, 'new');
  assert.equal(next.orders[0].id, 1001);
  assert.equal(next.nextOrderId, 1002);
  assert.deepEqual(next.cart, {});
});

test('invalid quantities, empty checkout and invalid customer details fail atomically', () => {
  const state = createDemoState();
  for (const quantity of [-1, 1.5, Infinity, 13]) assert.throws(() => setCartQuantity(state, 1, quantity));
  assert.throws(() => setCartQuantity(state, 999, 1), /не найден/);
  assert.throws(() => checkout(state, details), /пуста/);
  const withCart = setCartQuantity(state, 1, 1);
  assert.throws(() => checkout(withCart, { ...details, contact: ' ' }), /Контакт/);
  assert.equal(withCart.products[0].stock, 12);
  assert.deepEqual(setCartQuantity(withCart, 1, 0).cart, {});
});

test('cancellation restocks once; completed and cancelled orders cannot reopen', () => {
  const placed = checkout(setCartQuantity(createDemoState(), 1, 3), details);
  const cancelled = changeOrderStatus(placed, 1001, 'cancelled');
  assert.equal(cancelled.products[0].stock, 12);
  assert.equal(placed.products[0].stock, 9);
  assert.equal(changeOrderStatus(cancelled, 1001, 'cancelled').products[0].stock, 12);
  assert.throws(() => changeOrderStatus(cancelled, 1001, 'confirmed'), /Нельзя/);
  assert.throws(() => changeOrderStatus(placed, 1001, 'completed'), /Нельзя/);
  const delivered = changeOrderStatus(changeOrderStatus(changeOrderStatus(placed, 1001, 'confirmed'), 1001, 'shipping'), 1001, 'completed');
  assert.equal(delivered.products[0].stock, 9);
  assert.throws(() => changeOrderStatus(delivered, 1001, 'cancelled'), /Нельзя/);
});

test('deletion clears cart, retains order snapshots and never reuses identifiers', () => {
  const placed = checkout(setCartQuantity(createDemoState(), 1, 1), details);
  const deleted = deleteProduct(setCartQuantity(placed, 1, 1), 1);
  assert.equal(deleted.products.some((item) => item.id === 1), false);
  assert.deepEqual(deleted.cart, {});
  assert.equal(deleted.orders[0].items[0].name, 'Наушники Air Beat');
  assert.equal(changeOrderStatus(deleted, 1001, 'cancelled').products.length, 5);
  const cleared = deleteAllProducts(deleted);
  assert.equal(cleared.orders.length, 1);
  assert.equal(addProduct(cleared, draft).products[0].id, 7);
});

test('product validation and bulk addition are atomic', () => {
  const state = createDemoState();
  assert.throws(() => addProducts(state, [draft, { ...draft, stock: -1 }]), /Остаток/);
  assert.equal(state.products.length, 6);
  assert.equal(state.nextProductId, 7);
  for (const invalid of [{ price: NaN }, { price: -2 }, { color: '#zzzzzz' }, { imageUrl: 'javascript:alert(1)' }, { stock: 1.5 }]) {
    assert.throws(() => addProduct(state, { ...draft, ...invalid }));
  }
  const next = addProducts(state, [draft, draft]);
  assert.equal(next.products[6].color, '#ABCDEF');
  assert.deepEqual(next.products.slice(6).map((item) => item.id), [7, 8]);
});

test('CSV imports quoted delimiters, escaped quotes, multiline fields and decimal comma', () => {
  const csv = '\uFEFFимя;описание;цена;image_url;цвет;количество\r\n"Товар; один";"Первая строка\nВторая ""строка""";"199,99";https://example.com/photo.png;#abcdef;3\r\n';
  const [product] = parseProductImport(csv, 'csv');
  assert.equal(product.name, 'Товар; один');
  assert.equal(product.description, 'Первая строка\nВторая "строка"');
  assert.equal(product.price, 199.99);
  assert.equal(product.stock, 3);
  assert.equal(product.imageUrl, 'https://example.com/photo.png');
  assert.equal(product.color, '#ABCDEF');
  const comma = 'name,description,price,image_url,stock\n"A, B",Text,20,,1';
  assert.equal(parseProductImport(comma, 'csv')[0].name, 'A, B');
  const tab = 'name\tdescription\tprice\tstock\nItem\tText\t20\t1';
  assert.equal(parseProductImport(tab, 'csv')[0].stock, 1);
});

test('JSON aliases and optional color/image work; malformed imports fail completely', () => {
  const original = { name: 'Товар', description: 'Описание', price: 5, image_url: 'demo:watch', color: null, stock: 2 };
  assert.equal(parseProductImport(JSON.stringify([original]), 'json')[0].imageUrl, 'demo:watch');
  assert.equal(parseProductImport(JSON.stringify({ products: [original] }), 'json')[0].color, '#50A7EA');
  assert.throws(() => parseProductImport(JSON.stringify([original, { ...original, stock: -1 }]), 'json'), /Товар 2/);
  for (const csv of ['name,description,price,stock\n"Open,Text,5,2', 'name,description,price,stock\nName,Text,5', 'name,name,price,stock\nA,B,5,2']) {
    assert.throws(() => parseProductImport(csv, 'csv'));
  }
  for (const json of ['', '[]', '{}', '{broken']) assert.throws(() => parseProductImport(json, 'json'));
});

test('storage restores valid orders and falls back on corrupt stock, totals, counters or schema', () => {
  const state = checkout(setCartQuantity(createDemoState(), 1, 1), details);
  assert.deepEqual(restoreDemoState(JSON.stringify(state)), state);
  const broken = [null, '{bad', JSON.stringify({ ...state, version: 2 }), JSON.stringify({ ...state, cart: { 1: 999 } }), JSON.stringify({ ...state, nextProductId: 1 }), JSON.stringify({ ...state, orders: [{ ...state.orders[0], total: 1 }] })];
  for (const raw of broken) assert.deepEqual(restoreDemoState(raw), createDemoState());
});

test('cent totals avoid floating point accumulation errors', () => {
  let state = addProducts(deleteAllProducts(createDemoState()), [{ ...draft, price: 0.1 }, { ...draft, price: 0.2 }]);
  state = setCartQuantity(setCartQuantity(state, 7, 1), 8, 1);
  assert.equal(checkout(state, details).orders[0].total, 0.3);
});
