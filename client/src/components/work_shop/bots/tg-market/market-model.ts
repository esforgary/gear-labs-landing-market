export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  color: string;
  stock: number;
}

export type ProductDraft = Omit<Product, 'id'>;
export type OrderStatus = 'new' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    color: string;
    imageUrl: string;
  }[];
  name: string;
  contact: string;
  address: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
}

export interface DemoState {
  version: 1;
  products: Product[];
  orders: Order[];
  cart: Record<number, number>;
  nextProductId: number;
  nextOrderId: number;
}

export const STORAGE_KEY = 'gearlabs.tg-market.demo.v1';
export const statusLabels: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  shipping: 'В пути',
  completed: 'Получен',
  cancelled: 'Отменён',
};

const statuses = Object.keys(statusLabels) as OrderStatus[];
const transitions: Record<OrderStatus, OrderStatus[]> = {
  new: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};
const demoImages = new Set(['headphones', 'keyboard', 'speaker', 'watch', 'mouse', 'bag']);
const MAX_STOCK = 1_000_000;

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Некорректные данные.');
  return value as Record<string, unknown>;
}

function requiredText(value: unknown, label: string, max: number): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new Error(`${label}: введите текст до ${max} символов.`);
  }
  return value.trim();
}

function integer(value: unknown, label: string, min = 0, max = MAX_STOCK): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) {
    throw new Error(`${label}: введите целое число от ${min} до ${max}.`);
  }
  return value;
}

function price(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 10_000_000) {
    throw new Error('Цена должна быть больше нуля и не больше 10 000 000.');
  }
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  if (rounded === 0) throw new Error('Минимальная цена — 0,01.');
  return rounded;
}

function image(value: unknown): string {
  if (value == null || value === '') return 'demo:bag';
  const url = requiredText(value, 'Изображение', 2048);
  if (url.startsWith('demo:') && demoImages.has(url.slice(5))) return url;
  try {
    const parsed = new URL(url);
    if ((parsed.protocol === 'https:' || parsed.protocol === 'http:') && !parsed.username && !parsed.password) return url;
  } catch { /* Display a useful validation error below. */ }
  throw new Error('Укажите ссылку на изображение с http:// или https://.');
}

function color(value: unknown): string {
  if (value == null || value === '') return '#50A7EA';
  if (typeof value !== 'string' || !/^#[\da-f]{6}$/i.test(value.trim())) {
    throw new Error('Цвет должен быть в формате HEX, например #50A7EA.');
  }
  return value.trim().toUpperCase();
}

function productDraft(value: unknown): ProductDraft {
  const data = record(value);
  return {
    name: requiredText(data.name, 'Название', 100),
    description: requiredText(data.description, 'Описание', 2000),
    price: price(data.price),
    imageUrl: image(data.imageUrl),
    color: color(data.color),
    stock: integer(data.stock, 'Остаток'),
  };
}

function orderTotal(items: Order['items']): number {
  const cents = items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0);
  if (!Number.isSafeInteger(cents)) throw new Error('Сумма заказа слишком велика.');
  return cents / 100;
}

function checkedState(value: unknown): DemoState {
  const data = record(value);
  if (data.version !== 1 || !Array.isArray(data.products) || !Array.isArray(data.orders)) throw new Error('Некорректный формат магазина.');
  if (data.products.length > 10_000 || data.orders.length > 10_000) throw new Error('Слишком много записей в демомагазине.');
  const productIds = new Set<number>();
  const products = data.products.map((value): Product => {
    const item = record(value);
    const id = integer(item.id, 'Номер товара', 1, Number.MAX_SAFE_INTEGER - 1);
    if (productIds.has(id)) throw new Error('Номера товаров должны быть уникальными.');
    productIds.add(id);
    return { id, ...productDraft(item) };
  });
  const orderIds = new Set<number>();
  const orders = data.orders.map((value): Order => {
    const item = record(value);
    const id = integer(item.id, 'Номер заказа', 1, Number.MAX_SAFE_INTEGER - 1);
    if (orderIds.has(id)) throw new Error('Номера заказов должны быть уникальными.');
    orderIds.add(id);
    if (!Array.isArray(item.items) || item.items.length === 0 || item.items.length > 10_000) throw new Error('Заказ не может быть пустым.');
    const seen = new Set<number>();
    const items = item.items.map((value): Order['items'][number] => {
      const entry = record(value);
      const productId = integer(entry.productId, 'Номер товара', 1, Number.MAX_SAFE_INTEGER - 1);
      if (seen.has(productId)) throw new Error('Товар повторяется в заказе.');
      seen.add(productId);
      return {
        productId,
        name: requiredText(entry.name, 'Название', 100),
        price: price(entry.price),
        quantity: integer(entry.quantity, 'Количество', 1),
        color: color(entry.color),
        imageUrl: image(entry.imageUrl),
      };
    });
    const status = item.status as OrderStatus;
    if (!statuses.includes(status)) throw new Error('Неизвестный статус заказа.');
    const createdAt = requiredText(item.createdAt, 'Дата заказа', 40);
    if (!Number.isFinite(Date.parse(createdAt))) throw new Error('Некорректная дата заказа.');
    const total = orderTotal(items);
    if (item.total !== total) throw new Error('Сумма заказа не совпадает с товарами.');
    return {
      id, items, status, createdAt, total,
      name: requiredText(item.name, 'Имя', 100),
      contact: requiredText(item.contact, 'Контакт', 150),
      address: requiredText(item.address, 'Адрес', 500),
    };
  });
  const cart: Record<number, number> = {};
  for (const [key, value] of Object.entries(record(data.cart))) {
    const id = Number(key);
    if (!Number.isSafeInteger(id) || String(id) !== key) throw new Error('Некорректный товар в корзине.');
    const product = products.find((item) => item.id === id);
    if (!product) throw new Error('Товар из корзины больше не существует.');
    cart[id] = integer(value, 'Количество в корзине', 1, product.stock);
  }
  const nextProductId = integer(data.nextProductId, 'Счётчик товаров', 1, Number.MAX_SAFE_INTEGER - 1);
  const nextOrderId = integer(data.nextOrderId, 'Счётчик заказов', 1, Number.MAX_SAFE_INTEGER - 1);
  if (products.some((item) => item.id >= nextProductId) || orders.some((item) => item.id >= nextOrderId || item.items.some((entry) => entry.productId >= nextProductId))) {
    throw new Error('Некорректные счётчики магазина.');
  }
  return { version: 1, products, orders, cart, nextProductId, nextOrderId };
}

export function createDemoState(): DemoState {
  const seeds: ProductDraft[] = [
    { name: 'Наушники Air Beat', description: 'Беспроводные наушники с шумоподавлением и зарядным футляром.', price: 7490, imageUrl: 'demo:headphones', color: '#81A8E8', stock: 12 },
    { name: 'Клавиатура Type Mini', description: 'Компактная механическая клавиатура для работы и игр.', price: 5990, imageUrl: 'demo:keyboard', color: '#CAB5EA', stock: 8 },
    { name: 'Колонка Sound Cube', description: 'Портативная колонка с объёмным звуком и защитой от брызг.', price: 3990, imageUrl: 'demo:speaker', color: '#F5AD75', stock: 15 },
    { name: 'Часы Pulse Watch', description: 'Умные часы с уведомлениями, таймером и сменным ремешком.', price: 8990, imageUrl: 'demo:watch', color: '#84C5B0', stock: 6 },
    { name: 'Мышь Soft Click', description: 'Беспроводная мышь с тихими кнопками и удобной формой.', price: 2490, imageUrl: 'demo:mouse', color: '#E0ADBC', stock: 20 },
    { name: 'Рюкзак Urban Pack', description: 'Городской рюкзак с отделением для ноутбука и аксессуаров.', price: 4490, imageUrl: 'demo:bag', color: '#D4BD8D', stock: 10 },
  ];
  return { version: 1, products: seeds.map((item, index) => ({ id: index + 1, ...item })), orders: [], cart: {}, nextProductId: 7, nextOrderId: 1001 };
}

export function addProduct(state: DemoState, draft: ProductDraft): DemoState {
  return addProducts(state, [draft]);
}

export function addProducts(state: DemoState, drafts: ProductDraft[]): DemoState {
  const next = checkedState(state);
  if (!Array.isArray(drafts) || drafts.length === 0) throw new Error('В файле нет товаров.');
  if (next.products.length + drafts.length > 10_000) throw new Error('В демомагазине может быть не больше 10 000 товаров.');
  const products = drafts.map(productDraft);
  if (next.nextProductId + products.length >= Number.MAX_SAFE_INTEGER) throw new Error('Закончились доступные номера товаров.');
  next.products.push(...products.map((item, index) => ({ id: next.nextProductId + index, ...item })));
  next.nextProductId += products.length;
  return next;
}

export function deleteProduct(state: DemoState, id: number): DemoState {
  const next = checkedState(state);
  if (!next.products.some((item) => item.id === id)) throw new Error('Товар не найден.');
  next.products = next.products.filter((item) => item.id !== id);
  delete next.cart[id];
  return next;
}

export function deleteAllProducts(state: DemoState): DemoState {
  return { ...checkedState(state), products: [], cart: {} };
}

export function setCartQuantity(state: DemoState, id: number, quantity: number): DemoState {
  const next = checkedState(state);
  const product = next.products.find((item) => item.id === id);
  if (!product) throw new Error('Товар не найден.');
  integer(quantity, 'Количество');
  if (quantity > product.stock) throw new Error(`На складе осталось ${product.stock} шт.`);
  if (quantity === 0) delete next.cart[id];
  else next.cart[id] = quantity;
  return next;
}

export function checkout(state: DemoState, details: { name: string; contact: string; address: string }): DemoState {
  const next = checkedState(state);
  const name = requiredText(details.name, 'Имя', 100);
  const contact = requiredText(details.contact, 'Контакт', 150);
  const address = requiredText(details.address, 'Адрес', 500);
  if (next.orders.length >= 10_000) throw new Error('Достигнут лимит заказов демомагазина.');
  if (next.nextOrderId >= Number.MAX_SAFE_INTEGER - 1) throw new Error('Закончились доступные номера заказов.');
  const items: Order['items'] = Object.entries(next.cart).map(([key, quantity]) => {
    const product = next.products.find((item) => item.id === Number(key))!;
    return { productId: product.id, name: product.name, price: product.price, quantity, color: product.color, imageUrl: product.imageUrl };
  });
  if (!items.length) throw new Error('Корзина пуста. Добавьте товары.');
  const total = orderTotal(items);
  next.products = next.products.map((item) => ({ ...item, stock: item.stock - (next.cart[item.id] ?? 0) }));
  next.orders.unshift({ id: next.nextOrderId, items, name, contact, address, status: 'new', createdAt: new Date().toISOString(), total });
  next.nextOrderId += 1;
  next.cart = {};
  return next;
}

export function changeOrderStatus(state: DemoState, id: number, status: OrderStatus): DemoState {
  const next = checkedState(state);
  const order = next.orders.find((item) => item.id === id);
  if (!order) throw new Error('Заказ не найден.');
  if (!statuses.includes(status)) throw new Error('Неизвестный статус заказа.');
  if (order.status === status) return next;
  if (!transitions[order.status].includes(status)) throw new Error(`Нельзя перевести заказ из «${statusLabels[order.status]}» в «${statusLabels[status]}».`);
  if (status === 'cancelled') {
    next.products = next.products.map((product) => {
      const quantity = order.items.find((item) => item.productId === product.id)?.quantity ?? 0;
      return { ...product, stock: integer(product.stock + quantity, 'Остаток') };
    });
  }
  order.status = status;
  return next;
}

const aliases: Record<string, keyof ProductDraft> = {
  name: 'name', имя: 'name', название: 'name', наименование: 'name',
  description: 'description', описание: 'description',
  price: 'price', цена: 'price',
  imageurl: 'imageUrl', image_url: 'imageUrl', image: 'imageUrl', изображение: 'imageUrl', 'ссылка на изображение': 'imageUrl',
  color: 'color', цвет: 'color',
  stock: 'stock', quantity: 'stock', количество: 'stock', остаток: 'stock',
};

function importDraft(value: unknown, index: number): ProductDraft {
  try {
    const input = record(value);
    const draft: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      const alias = key.trim().toLowerCase();
      if (!Object.hasOwn(aliases, alias)) continue;
      const field = aliases[alias];
      if (Object.hasOwn(draft, field)) throw new Error(`Поле «${field}» повторяется.`);
      draft[field] = value;
    }
    for (const field of ['price', 'stock']) {
      if (typeof draft[field] === 'string') {
        const number = (draft[field] as string).trim().replace(',', '.');
        if (!/^\d+(?:\.\d+)?$/.test(number)) throw new Error(`${field === 'price' ? 'Цена' : 'Остаток'}: неверное число.`);
        draft[field] = Number(number);
      }
    }
    return productDraft(draft);
  } catch (error) {
    throw new Error(`Товар ${index + 1}: ${error instanceof Error ? error.message : 'неверные данные.'}`);
  }
}

function csvRows(text: string): string[][] {
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && (char === '\n' || char === '\r')) break;
    else if (!quoted && Object.hasOwn(counts, char)) counts[char] += 1;
  }
  const delimiter = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let closedQuote = false;
  const finishField = () => { row.push(field); field = ''; closedQuote = false; };
  const finishRow = () => { finishField(); if (row.some((cell) => cell.trim())) rows.push(row); row = []; };
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') { inQuotes = false; closedQuote = true; }
      else field += char;
    } else if (char === delimiter) finishField();
    else if (char === '\r' || char === '\n') { finishRow(); if (char === '\r' && text[index + 1] === '\n') index += 1; }
    else if (char === '"') {
      if (field.trim() || closedQuote) throw new Error('CSV: кавычки внутри поля нужно удваивать.');
      field = ''; inQuotes = true;
    } else if (closedQuote) {
      if (char !== ' ' && char !== '\t') throw new Error('CSV: после кавычек ожидается разделитель.');
    } else field += char;
  }
  if (inQuotes) throw new Error('CSV: не закрыты кавычки.');
  finishRow();
  return rows;
}

export function parseProductImport(text: string, format: 'json' | 'csv'): ProductDraft[] {
  if (typeof text !== 'string' || !text.trim()) throw new Error('Файл пуст.');
  if (text.length > 5_000_000) throw new Error('Размер файла должен быть не больше 5 МБ.');
  const source = text.replace(/^\uFEFF/, '').trim();
  let rows: unknown[];
  if (format === 'json') {
    let data: unknown;
    try { data = JSON.parse(source); } catch { throw new Error('Не удалось прочитать JSON. Проверьте формат файла.'); }
    rows = Array.isArray(data) ? data : record(data).products as unknown[];
    if (!Array.isArray(rows)) throw new Error('JSON должен содержать массив товаров.');
  } else if (format === 'csv') {
    const table = csvRows(source);
    const headers = table.shift();
    if (!headers?.length) throw new Error('В CSV нет заголовков.');
    const normalized = headers.map((header) => header.trim());
    if (new Set(normalized.map((key) => key.toLowerCase())).size !== normalized.length) throw new Error('Заголовки CSV повторяются.');
    rows = table.map((cells, index) => {
      if (cells.length !== headers.length) throw new Error(`Строка CSV ${index + 2}: число полей не совпадает с заголовком.`);
      return Object.fromEntries(normalized.map((header, index) => [header, cells[index]]));
    });
  } else throw new Error('Поддерживаются файлы JSON и CSV.');
  if (!rows.length) throw new Error('В файле нет товаров.');
  if (rows.length > 10_000) throw new Error('В одном файле может быть не больше 10 000 товаров.');
  return rows.map(importDraft);
}

export function restoreDemoState(raw: string | null): DemoState {
  if (!raw || raw.length > 10_000_000) return createDemoState();
  try { return checkedState(JSON.parse(raw)); } catch { return createDemoState(); }
}
