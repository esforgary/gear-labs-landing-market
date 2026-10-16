import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft, CheckCheck, ChevronLeft, Menu, Minus, Plus, Search, Send, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../../apps/mobile-apps/app-preview-presentation";
import { getTgMarketPreviewCopy } from "./preview-copy";
import { ProductArt } from "./product-art";
import { STORAGE_KEY, addProduct, addProducts, changeOrderStatus, checkout, createDemoState, deleteAllProducts, deleteProduct, parseProductImport, restoreDemoState, setCartQuantity, statusLabels, type DemoState, type OrderStatus, type ProductDraft } from "./market-model";
import "./tg-market.scss";

type Role = "customer" | "admin";
type Action = { label: string; value: string };
type Message = { id: string; text: string; user?: boolean; actions?: Action[]; orderId?: number; time: string };
type Step = keyof ProductDraft | "orderId" | "bulk";
type Wizard = { step: Step; values: Partial<ProductDraft> } | null;
const money = (value: number) => `${value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₽`;
const action = (label: string, value: string): Action => ({ label, value });
const cancelActions = [action("Отмена", "/cancel")];
const prompts: Record<keyof ProductDraft, string> = {
  name: "Как называется товар?",
  description: "Введите описание товара.",
  price: "Введите цену в рублях, например 1990 или 1990,50.",
  imageUrl: "Пришлите HTTPS-ссылку на изображение или пропустите этот шаг — добавим иллюстрацию.",
  color: "Укажите цвет в HEX, например #57a8df, или пропустите шаг.",
  stock: "Сколько единиц на складе? Введите целое число от 0 до 100000.",
};
const steps: (keyof ProductDraft)[] = ["name", "description", "price", "imageUrl", "color", "stock"];
function message(text: string, actions?: Action[], user = false, orderId?: number): Message {
  return { id: crypto.randomUUID(), text, actions, user, orderId, time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) };
}
function welcome(role: Role): Message {
  return role === "admin"
    ? message("Панель магазина 🛠\nДобавляйте товары, управляйте остатками и заказами. Изменения сразу видны покупателю.", [action("＋ Добавить товар", "/add"), action("Удалить товар", "/delete"), action("Заказы магазина", "/orders"), action("Импорт товаров", "/import")])
    : message("Привет! Это TG Market 👋\nТехника и аксессуары в одном чате. Откройте каталог, соберите корзину — я помогу оформить заказ и узнать его статус.", [action("🛍 Открыть каталог", "/shop"), action("📦 Мои заказы", "/orders"), action("Узнать статус заказа", "/status")]);
}
function readState() {
  try { return restoreDemoState(localStorage.getItem(STORAGE_KEY)); } catch { return createDemoState(); }
}

export default function TgMarketPreview() {
  const { lang } = useThemeLang();
  const copy = getTgMarketPreviewCopy(lang);
  const [state, setState] = useState<DemoState>(readState);
  const stateRef = useRef(state);
  const [role, setRole] = useState<Role>("customer");
  const [logs, setLogs] = useState<Record<Role, Message[]>>(() => ({ customer: [welcome("customer")], admin: [welcome("admin")] }));
  const [input, setInput] = useState("");
  const [wizard, setWizard] = useState<Wizard>(null);
  const [shop, setShop] = useState<"catalog" | "cart" | "checkout" | null>(null);
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [customer, setCustomer] = useState({ name: "Демо-покупатель", contact: "@demo_customer", address: "Пункт выдачи · Центральный" });
  const chatRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const importRevision = useRef(0);

  useEffect(() => () => { importRevision.current += 1; }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [logs, role, wizard]);

  function update(next: DemoState) {
    stateRef.current = next;
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
    return next;
  }
  function reply(text: string, actions?: Action[], orderId?: number, targetRole = role) {
    setLogs(current => ({ ...current, [targetRole]: [...current[targetRole].slice(-79), message(text, actions, false, orderId)] }));
  }
  function switchRole(next: Role) {
    importRevision.current += 1;
    setRole(next); setWizard(null); setShop(null); setMenu(false); setInput(""); setError(""); setResetConfirm(false);
  }
  function showOrder(id: number) {
    const order = stateRef.current.orders.find(item => item.id === id);
    if (!order) { reply(`Заказ №${id} не найден. Посмотрите список заказов.`, [action("Мои заказы", "/orders")]); return; }
    reply(`Заказ №${order.id}`, undefined, id);
  }
  function promptStep(step: keyof ProductDraft) {
    reply(prompts[step], [...(step === "imageUrl" || step === "color" ? [action("Пропустить", "skip")] : []), ...cancelActions]);
  }
  function answerWizard(value: string) {
    if (!wizard) return;
    if (wizard.step === "orderId") {
      const id = Number(value.replace(/^#/, ""));
      if (!Number.isSafeInteger(id) || id < 1) { reply("Введите номер заказа, например 1001.", cancelActions); return; }
      setWizard(null); showOrder(id); return;
    }
    if (wizard.step === "bulk") {
      if (role !== "admin") return;
      try {
        const drafts = parseProductImport(value, value.trim().startsWith("[") || value.trim().startsWith("{") ? "json" : "csv");
        update(addProducts(stateRef.current, drafts)); setWizard(null);
        reply(`Импортировано товаров: ${drafts.length}. Каталог обновлён.`, [action("Открыть каталог", "/shop")]);
      } catch (cause) { reply(cause instanceof Error ? cause.message : "Проверьте формат файла.", [action("Загрузить CSV / JSON", "import-file"), ...cancelActions]); }
      return;
    }
    if (role !== "admin") return;
    const step = wizard.step;
    const values = { ...wizard.values };
    const invalid = (text: string) => reply(text, [...(step === "imageUrl" || step === "color" ? [action("Пропустить", "skip")] : []), ...cancelActions]);
    if (step === "name" || step === "description") {
      if (!value.trim() || value.length > (step === "name" ? 100 : 1500)) return invalid(step === "name" ? "Название должно содержать от 1 до 100 символов." : "Описание должно содержать от 1 до 1500 символов.");
      values[step] = value.trim();
    } else if (step === "price") {
      const price = Number(value.replace(",", "."));
      if (!/^\d+(?:[.,]\d{1,2})?$/.test(value) || !Number.isFinite(price) || price <= 0 || price > 10000000) return invalid("Цена должна быть больше нуля, не больше 10 000 000 ₽ и содержать максимум два знака после запятой.");
      values.price = price;
    } else if (step === "stock") {
      const stock = Number(value);
      if (!/^\d+$/.test(value) || !Number.isSafeInteger(stock) || stock < 0 || stock > 100000) return invalid("Введите целый остаток от 0 до 100000.");
      values.stock = stock;
    } else if (step === "imageUrl") {
      try {
        if (value !== "skip" && (new URL(value).protocol !== "https:" || value.length > 2000)) return invalid("Нужна полная HTTPS-ссылка на изображение.");
      } catch { return invalid("Нужна полная HTTPS-ссылка или кнопка «Пропустить»."); }
      values.imageUrl = value === "skip" ? "demo:bag" : value;
    } else if (step === "color") {
      if (value !== "skip" && !/^#[0-9a-f]{6}$/i.test(value)) return invalid("Цвет должен выглядеть как #57a8df: решётка и шесть HEX-символов.");
      values.color = value === "skip" ? "#57a8df" : value;
    }
    if (step === "stock") {
      try {
        update(addProduct(stateRef.current, values as ProductDraft)); setWizard(null);
        reply(`✅ Товар «${values.name}» добавлен.\nЦена: ${money(values.price!)} · Остаток: ${values.stock}`, [action("Открыть каталог", "/shop"), action("Добавить ещё", "add-single")]);
      } catch (cause) { invalid(cause instanceof Error ? cause.message : "Проверьте данные товара."); }
    } else {
      const next = steps[steps.indexOf(step) + 1];
      setWizard({ step: next, values }); promptStep(next);
    }
  }
  function run(value: string) {
    importRevision.current += 1;
    setMenu(false); setError("");
    if (/^(\/add|\/delete|\/drop|\/import|add-single|delete:|confirm-delete:|delete-all|confirm-delete-all|import-file|status:)/.test(value) && role !== "admin") {
      reply("Эта команда доступна в демонстрационном режиме администратора.", [action("Перейти к администратору", "/admin")]); return;
    }
    try {
      if (value === "/admin") { switchRole("admin"); return; }
      if (value === "/customer") { switchRole("customer"); return; }
      if (value === "/cancel") { setWizard(null); reply("Действие отменено.", [action("Главное меню", "/start")]); return; }
      if (value === "skip") { if (wizard?.step === "imageUrl" || wizard?.step === "color") answerWizard("skip"); return; }
      if (value === "/start") { setWizard(null); const entry = welcome(role); setLogs(current => ({ ...current, [role]: [...current[role].slice(-79), entry] })); return; }
      if (value === "/shop" || value === "/cart") { setWizard(null); setShop(value === "/shop" ? "catalog" : "cart"); return; }
      if (value === "/help") {
        reply(role === "admin" ? "/add — добавить товар\n/delete — удалить товар\n/drop — очистить каталог\n/import — импорт CSV / JSON\n/orders — заказы и их статусы\n/shop — каталог\n/customer — режим покупателя\n/cancel — отмена" : "/shop — каталог\n/cart — корзина\n/orders — мои заказы\n/status 1001 — статус по номеру\n/admin — демонстрация админ-панели\n/cancel — отмена"); return;
      }
      if (value === "/orders") {
        setWizard(null);
        const orders = stateRef.current.orders;
        reply(orders.length ? (role === "admin" ? "Заказы магазина:" : "Ваши заказы:") : "Заказов пока нет. Добавьте товары в корзину и оформите первый заказ.", orders.length ? orders.slice().sort((a, b) => b.id - a.id).map(order => action(`№${order.id} · ${statusLabels[order.status]} · ${money(order.total)}`, `order:${order.id}`)) : [action("Открыть каталог", "/shop")]); return;
      }
      if (value.startsWith("order:")) { showOrder(Number(value.split(":")[1])); return; }
      if (value === "/status" || value.startsWith("/status ")) {
        const id = value.split(/\s+/)[1];
        if (id) { setWizard(null); const number = Number(id.replace(/^#/, "")); if (!Number.isSafeInteger(number) || number < 1) throw new Error("Укажите корректный номер заказа."); showOrder(number); }
        else { setWizard({ step: "orderId", values: {} }); reply("Напишите номер заказа. Его можно найти в разделе «Мои заказы».", cancelActions); }
        return;
      }
      if (value === "/add") { setWizard(null); reply("Как добавим товары?", [action("Один товар", "add-single"), action("Импорт CSV / JSON", "/import"), ...cancelActions]); return; }
      if (value === "add-single") { setWizard({ step: "name", values: {} }); promptStep("name"); return; }
      if (value === "/import") {
        setWizard({ step: "bulk", values: {} });
        reply('Загрузите CSV / JSON или вставьте данные сообщением. Поля: name, description, price, image_url, color, stock.\nПример JSON:\n[{"name":"Чехол","description":"Мягкий чехол","price":490,"image_url":"","color":"#57a8df","stock":10}]', [action("Загрузить CSV / JSON", "import-file"), ...cancelActions]); return;
      }
      if (value === "import-file") { setWizard({ step: "bulk", values: {} }); fileRef.current?.click(); return; }
      if (value === "/delete") {
        setWizard(null);
        reply("Выберите товар для удаления:", [...stateRef.current.products.map(product => action(`${product.name} · ${product.stock} шт.`, `delete:${product.id}`)), action("Удалить все товары", "delete-all"), ...cancelActions]); return;
      }
      if (value.startsWith("delete:")) {
        const id = Number(value.split(":")[1]); const product = stateRef.current.products.find(item => item.id === id);
        if (!product) throw new Error("Товар уже удалён.");
        reply(`Удалить «${product.name}» из каталога? Оформленные заказы сохранятся.`, [action("Да, удалить", `confirm-delete:${id}`), ...cancelActions]); return;
      }
      if (value.startsWith("confirm-delete:")) { update(deleteProduct(stateRef.current, Number(value.split(":")[1]))); reply("Товар удалён из каталога.", [action("Открыть каталог", "/shop")]); return; }
      if (value === "delete-all" || value === "/drop") { setWizard(null); reply("Удалить все товары? Каталог и корзина станут пустыми. История заказов останется.", [action("Да, очистить каталог", "confirm-delete-all"), ...cancelActions]); return; }
      if (value === "confirm-delete-all") { update(deleteAllProducts(stateRef.current)); reply("Каталог очищен.", [action("Добавить товар", "/add")]); return; }
      if (value.startsWith("status:") || value.startsWith("cancel-order:")) {
        const [, rawId, rawStatus] = value.split(":"); const id = Number(rawId);
        const status = value.startsWith("cancel-order:") ? "cancelled" : rawStatus as OrderStatus;
        const order = stateRef.current.orders.find(item => item.id === id);
        if (value.startsWith("cancel-order:") && (!order || !["new", "confirmed"].includes(order.status))) throw new Error("Этот заказ уже нельзя отменить покупателю.");
        update(changeOrderStatus(stateRef.current, id, status));
        reply(`Заказ №${id}: ${statusLabels[status]}.`, undefined, id);
        if (role === "admin") reply(`Обновление по заказу №${id}: ${statusLabels[status]}.`, undefined, id, "customer");
        return;
      }
      reply("Я не узнал команду. Выберите действие в меню или напишите /help.", [action("Каталог", "/shop"), action("Все команды", "/help")]);
    } catch (cause) { reply(cause instanceof Error ? cause.message : "Не удалось выполнить действие."); }
  }
  function send(event: FormEvent) {
    event.preventDefault(); const value = input.trim(); if (!value) return;
    setInput(""); setLogs(current => ({ ...current, [role]: [...current[role].slice(-79), message(value, undefined, true)] }));
    if (value.startsWith("/")) run(value); else if (wizard) answerWizard(value); else run(value);
  }
  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file || role !== "admin") return;
    const revision = ++importRevision.current;
    try {
      if (!/\.(csv|json)$/i.test(file.name)) throw new Error("Выберите файл CSV или JSON.");
      if (file.size > 1024 * 1024) throw new Error("Размер файла должен быть не больше 1 МБ.");
      const content = await file.text();
      if (revision !== importRevision.current) return;
      const drafts = parseProductImport(content, /\.json$/i.test(file.name) ? "json" : "csv");
      update(addProducts(stateRef.current, drafts)); setWizard(null);
      reply(`✅ Импортировано товаров: ${drafts.length}.`, [action("Каталог товаров", "/shop")]);
    } catch (cause) { if (revision === importRevision.current) reply(cause instanceof Error ? cause.message : "Не удалось прочитать файл.", [action("Выбрать другой файл", "import-file"), ...cancelActions]); }
  }
  function quantity(id: number, value: number) {
    try { update(setCartQuantity(stateRef.current, id, value)); setError(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось изменить корзину."); }
  }
  function placeOrder(event: FormEvent) {
    event.preventDefault();
    try {
      const next = update(checkout(stateRef.current, customer)); const order = next.orders.find(item => item.id === next.nextOrderId - 1)!;
      setShop(null); setError("");
      reply(`✅ Заказ №${order.id} оформлен!\nЭто демонстрация: оплата не списывается. Статус можно проверить прямо в чате.`, undefined, order.id, "customer");
      reply(`🛍 Новый заказ №${order.id} от ${order.name}.`, undefined, order.id, "admin");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось оформить заказ."); }
  }
  function reset() {
    update(createDemoState()); setLogs({ customer: [welcome("customer")], admin: [welcome("admin")] }); switchRole("customer"); setSearch("");
    setCustomer({ name: "Демо-покупатель", contact: "@demo_customer", address: "Пункт выдачи · Центральный" });
  }
  const cart = state.products.filter(product => state.cart[product.id] > 0);
  const cartCount = cart.reduce((sum, product) => sum + state.cart[product.id], 0);
  const total = cart.reduce((sum, product) => sum + product.price * state.cart[product.id], 0);
  const products = state.products.filter(product => (role === "admin" || product.stock > 0) && `${product.name} ${product.description}`.toLocaleLowerCase("ru").includes(search.toLocaleLowerCase("ru")));

  return <div className="mobile-app-preview mobile-app-preview--tg-market">
    <div className="mobile-app-preview__device"><div className="app-phone-frame"><div className="tg-market-phone">
      <PhoneStatusBar />
      <header className="tg-market-header"><span aria-hidden="true"><ChevronLeft size={22} /></span><span className="tg-market-avatar"><ShoppingBag size={20} /></span><div><h3>TG Market <span>✓</span></h3><small>бот · интернет-магазин</small></div><button aria-label="Команды бота" onClick={() => setMenu(!menu)}><Menu size={20} /></button></header>
      <div className="tg-market-role-banner">Демо Telegram · {role === "admin" ? "администратор" : "покупатель"}</div>
      <div className="tg-market-chat" ref={chatRef} role="log" aria-label="Переписка с ботом" aria-live="polite">
        {logs[role].map(entry => <div className={`tg-market-message ${entry.user ? "is-user" : ""}`} key={entry.id}>
          <div className="tg-market-message__text">{entry.text}</div>
          {entry.orderId && (() => {
            const order = state.orders.find(item => item.id === entry.orderId); if (!order) return null;
            const next: Partial<Record<OrderStatus, OrderStatus>> = { new: "confirmed", confirmed: "shipping", shipping: "completed" };
            return <div className="tg-market-order"><strong>{statusLabels[order.status]}</strong>{order.items.map(item => <p key={item.productId}>{item.name} × {item.quantity}<b>{money(item.price * item.quantity)}</b></p>)}<p>Итого<b>{money(order.total)}</b></p><small>{order.name} · {order.contact}<br />{order.address}</small><div className="tg-market-actions">
              {role === "admin" && next[order.status] && <button onClick={() => run(`status:${order.id}:${next[order.status]}`)}>{statusLabels[next[order.status]!]}</button>}
              {(role === "admin" ? !["completed", "cancelled"].includes(order.status) : ["new", "confirmed"].includes(order.status)) && <button onClick={() => role === "admin" ? run(`status:${order.id}:cancelled`) : run(`cancel-order:${order.id}`)}>Отменить заказ</button>}
            </div></div>;
          })()}
          {entry.actions && <div className="tg-market-actions">{entry.actions.map(item => <button key={item.value} onClick={() => run(item.value)}>{item.label}</button>)}</div>}
          <span className="tg-market-message__time">{entry.time}{entry.user && <CheckCheck size={12} />}</span>
        </div>)}
      </div>
      <div className="tg-market-quick-actions"><button onClick={() => run("/shop")}>Каталог</button><button onClick={() => run(role === "admin" ? "/add" : "/cart")}>{role === "admin" ? "＋ Товар" : `Корзина${cartCount ? ` · ${cartCount}` : ""}`}</button><button onClick={() => run("/orders")}>Заказы</button></div>
      <form className="tg-market-composer" onSubmit={send}><button className="tg-market-menu-button" type="button" aria-label="Открыть меню команд" aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu size={20} /></button><input aria-label="Сообщение боту" placeholder={wizard ? "Ваш ответ…" : "Сообщение"} value={input} maxLength={wizard?.step === "bulk" ? 20000 : 2000} onChange={event => setInput(event.target.value)} /><button type="submit" aria-label="Отправить сообщение боту" disabled={!input.trim()}><Send size={19} /></button></form>
      {menu && <div className="tg-market-menu"><button onClick={() => run("/start")}>/start · Главное меню</button><button onClick={() => run("/shop")}>/shop · Каталог</button><button onClick={() => run("/orders")}>/orders · Заказы</button><button onClick={() => run("/status")}>/status · Статус заказа</button>{role === "admin" && <><button onClick={() => run("/add")}>/add · Добавить товар</button><button onClick={() => run("/delete")}>/delete · Удалить товар</button><button onClick={() => run("/import")}>/import · Импорт товаров</button></>}<button onClick={() => run(role === "admin" ? "/customer" : "/admin")}>{role === "admin" ? "Режим покупателя" : "Режим администратора"}</button><button onClick={() => run("/cancel")}>/cancel · Отменить ввод</button></div>}
      <input ref={fileRef} type="file" accept=".csv,.json,application/json,text/csv" onChange={event => void importFile(event)} hidden aria-label="Импорт товаров CSV или JSON" />

      {shop && <section className="tg-market-shop" aria-label="Магазин TG Market">
        <header className="tg-market-shop__header"><button aria-label="Назад из магазина" onClick={() => { setError(""); setShop(shop === "catalog" ? null : shop === "checkout" ? "cart" : "catalog"); }}><ArrowLeft size={19} /></button><div><h3>{shop === "catalog" ? "Каталог" : shop === "cart" ? "Корзина" : "Оформление"}</h3><small>TG Market · mini app</small></div><button aria-label={`Корзина, товаров: ${cartCount}`} onClick={() => { setShop("cart"); setError(""); }}><ShoppingCart size={20} /><span>{cartCount}</span></button></header>
        {shop === "catalog" && <label className="tg-market-search"><Search size={15} /><input placeholder="Найти товар" aria-label="Поиск товаров" value={search} onChange={event => setSearch(event.target.value)} /></label>}
        <div className="tg-market-shop__body">
          {error && <p className="tg-market-error" role="alert">{error}</p>}
          {shop === "catalog" && <>{products.length === 0 && <div className="tg-market-empty"><ShoppingBag size={30} /><p>{search ? "По вашему запросу ничего не найдено." : "Каталог пока пуст. Добавьте товары в режиме администратора."}</p></div>}{products.map(product => <article className="tg-market-product" key={product.id}><div className="tg-market-product__art"><ProductArt product={product} /></div><div className="tg-market-product__info"><h4>{product.name}</h4><p>{product.description}</p><small>В наличии: {product.stock} шт.</small><button className="tg-market-product__buy" disabled={!product.stock || (state.cart[product.id] ?? 0) >= product.stock} onClick={() => quantity(product.id, (stateRef.current.cart[product.id] ?? 0) + 1)}>{money(product.price)} <Plus size={14} />{state.cart[product.id] ? ` · ${state.cart[product.id]}` : ""}</button></div></article>)}</>}
          {shop === "cart" && <>{cart.length === 0 && <div className="tg-market-empty"><ShoppingCart size={32} /><h4>Корзина пуста</h4><button className="tg-market-primary" onClick={() => setShop("catalog")}>Перейти в каталог</button></div>}{cart.map(product => <article className="tg-market-cart-line" key={product.id}><ProductArt product={product} /><div><h4>{product.name}</h4><small>{money(product.price * state.cart[product.id])}</small><div><button aria-label={`Уменьшить количество ${product.name}`} onClick={() => quantity(product.id, state.cart[product.id] - 1)}><Minus size={14} /></button><span>{state.cart[product.id]}</span><button aria-label={`Увеличить количество ${product.name}`} onClick={() => quantity(product.id, state.cart[product.id] + 1)}><Plus size={14} /></button><button aria-label={`Убрать ${product.name} из корзины`} onClick={() => quantity(product.id, 0)}><X size={14} /></button></div></div></article>)}</>}
          {shop === "checkout" && <form id="tg-market-checkout" className="tg-market-checkout" onSubmit={placeOrder}><p>Демонстрационный заказ. Используйте вымышленные данные.</p><label>Имя<input value={customer.name} maxLength={100} required onChange={event => setCustomer({ ...customer, name: event.target.value })} /></label><label>Telegram или телефон<input value={customer.contact} maxLength={100} required onChange={event => setCustomer({ ...customer, contact: event.target.value })} /></label><label>Адрес или пункт выдачи<textarea value={customer.address} maxLength={300} required rows={3} onChange={event => setCustomer({ ...customer, address: event.target.value })} /></label><p>Оплата не списывается. После оформления бот пришлёт номер заказа.</p></form>}
        </div>
        <footer className="tg-market-shop__footer">{shop === "catalog" ? <button className="tg-market-primary" onClick={() => setShop("cart")}>Корзина · {cartCount} · {money(total)}</button> : <><strong>Итого <span>{money(total)}</span></strong>{shop === "cart" ? <button key="checkout-next" type="button" className="tg-market-primary" disabled={!cart.length} onClick={() => { setShop("checkout"); setError(""); }}>Оформить заказ</button> : <button key="checkout-submit" className="tg-market-primary" disabled={!cart.length} form="tg-market-checkout" type="submit">Подтвердить заказ</button>}</>}</footer>
      </section>}
    </div></div></div>
    <div className="tg-market-presentation"><AppPreviewCopy kicker={copy.kicker} title="TG Market" description={copy.description} features={copy.features} />
      <div className="tg-market-controls"><div className="tg-market-role-switch" aria-label={copy.demoMode}><button aria-pressed={role === "customer"} onClick={() => switchRole("customer")}>{copy.customer}</button><button aria-pressed={role === "admin"} onClick={() => switchRole("admin")}>{copy.admin}</button></div><p className="tg-market-demo-note">{copy.demoNote}</p>{storageError && <p className="tg-market-error" role="status">{copy.storageError}</p>}{resetConfirm ? <div className="tg-market-reset"><span>{copy.resetQuestion}</span><button onClick={reset}>{copy.confirmReset}</button><button onClick={() => setResetConfirm(false)}>{copy.cancel}</button></div> : <button className="tg-market-reset" onClick={() => setResetConfirm(true)}>{copy.reset}</button>}</div>
    </div>
  </div>;
}
