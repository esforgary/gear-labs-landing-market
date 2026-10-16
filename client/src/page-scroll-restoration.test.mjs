import assert from 'node:assert/strict';
import test from 'node:test';
import { startPageScrollRestoration } from './page-scroll-restoration.ts';

const prefix = 'gearlabs:page-scroll:v1:';

function browser(t, { type = 'reload', hash = '#catalog', position, height = 5000, invalidStorage = false } = {}) {
  const frames = new Map();
  const timers = new Map();
  const storage = new Map();
  const elements = new Map();
  const observers = [];
  let id = 0;
  let now = 0;
  const window = Object.assign(new EventTarget(), {
    location: { pathname: '/', search: '', hash },
    history: { scrollRestoration: 'auto' },
    performance: { getEntriesByType: () => [{ type }], now: () => now },
    innerWidth: 1000, innerHeight: 800, scrollX: 0, scrollY: 0,
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => {
        if (invalidStorage) throw new Error('Storage unavailable');
        storage.set(key, value);
      },
    },
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    setTimeout: callback => { timers.set(++id, callback); return id; },
    clearTimeout: key => timers.delete(key),
    scrollTo: ({ left = window.scrollX, top = window.scrollY }) => {
      window.scrollX = left;
      window.scrollY = top;
      window.dispatchEvent(new Event('scroll'));
    },
  });
  const document = Object.assign(new EventTarget(), {
    documentElement: { scrollHeight: height, scrollWidth: 1000 },
    body: {}, visibilityState: 'visible',
    getElementById: key => elements.get(key),
  });
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.active = true; observers.push(this); }
    observe() {}
    disconnect() { this.active = false; }
  }
  for (const [key, value] of Object.entries({ window, document, ResizeObserver })) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true });
    t.after(() => previous ? Object.defineProperty(globalThis, key, previous) : delete globalThis[key]);
  }
  if (position !== undefined) storage.set(prefix + '/' + hash, JSON.stringify(position));
  return {
    window, document, storage, elements,
    frame() {
      now += 16;
      const current = [...frames.values()];
      frames.clear();
      current.forEach(callback => callback(now));
    },
    resize(nextHeight) {
      document.documentElement.scrollHeight = nextHeight;
      observers.filter(observer => observer.active).forEach(observer => observer.callback());
    },
    expire() {
      const current = [...timers.values()];
      timers.clear();
      current.forEach(callback => callback());
    },
    saved(hash = window.location.hash) { return JSON.parse(storage.get(prefix + '/' + hash)); },
  };
}

test('reload keeps its target until asynchronous layout growth and overrides the old hash anchor', t => {
  const b = browser(t, { position: { x: 0, y: 2400 }, height: 800 });
  b.elements.set('catalog', { scrollIntoView: () => assert.fail('Reload must not jump to the section start') });
  const cleanup = startPageScrollRestoration();
  b.frame();
  b.window.dispatchEvent(new Event('pagehide'));
  assert.equal(b.saved().y, 2400);
  b.resize(5000);
  b.frame();
  assert.equal(b.window.scrollY, 2400);
  b.window.scrollTo({ top: 1800 }); // A late browser anchor/layout adjustment.
  b.frame();
  assert.equal(b.window.scrollY, 2400);
  cleanup();
  assert.equal(b.window.history.scrollRestoration, 'auto');
});

test('StrictMode effect replay cannot replace a pending saved position with zero', t => {
  const b = browser(t, { position: { x: 0, y: 3200 }, height: 800 });
  startPageScrollRestoration()();
  assert.equal(b.saved().y, 3200);
  const cleanup = startPageScrollRestoration();
  b.resize(5000);
  b.frame();
  assert.equal(b.window.scrollY, 3200);
  cleanup();
});

test('user scrolling cancels restoration and saves the new position', t => {
  const b = browser(t, { position: { x: 0, y: 2400 }, height: 800 });
  const cleanup = startPageScrollRestoration();
  b.window.dispatchEvent(new Event('wheel'));
  b.window.scrollTo({ top: 700 });
  b.resize(6000);
  b.frame();
  assert.equal(b.window.scrollY, 700);
  assert.equal(b.saved().y, 700);
  cleanup();
});

test('new visits honor anchors and route changes wait for the main page to mount', t => {
  const b = browser(t, { type: 'navigate', position: { x: 0, y: 2400 } });
  let visits = 0;
  b.elements.set('catalog', { scrollIntoView: () => visits++ });
  const cleanup = startPageScrollRestoration();
  b.frame();
  assert.equal(visits, 1);
  assert.equal(b.window.scrollY, 0);
  b.window.location.hash = '#constructor';
  b.window.scrollY = 2000;
  b.window.dispatchEvent(new Event('hashchange'));
  b.frame();
  assert.equal(b.window.scrollY, 0);
  b.window.location.hash = '#about';
  b.window.dispatchEvent(new Event('hashchange'));
  b.frame();
  b.elements.set('about', { scrollIntoView: () => visits++ });
  b.frame();
  assert.equal(visits, 2);
  cleanup();
});

test('hash navigation wins during restoration and replaceState-style anchors get their own saved position', t => {
  const b = browser(t, { position: { x: 0, y: 2400 }, height: 800 });
  const cleanup = startPageScrollRestoration();
  b.window.location.hash = '#constructor';
  b.window.dispatchEvent(new Event('hashchange'));
  b.resize(6000);
  b.frame();
  assert.equal(b.window.scrollY, 0);
  b.window.location.hash = '#about'; // Header uses replaceState, which does not emit hashchange.
  b.window.scrollTo({ top: 3600 });
  b.frame();
  assert.equal(b.saved('#about').y, 3600);
  assert.equal(b.saved('#catalog').y, 2400);
  cleanup();
});

test('unavailable or malformed storage is harmless and restoration has a bounded lifetime', t => {
  const b = browser(t, { position: { x: 0, y: 'invalid' }, invalidStorage: true });
  const cleanup = startPageScrollRestoration();
  b.window.dispatchEvent(new Event('pagehide'));
  assert.doesNotThrow(cleanup);
  b.window.sessionStorage.setItem = (key, value) => b.storage.set(key, value);
  b.storage.set(prefix + '/#catalog', JSON.stringify({ x: 0, y: 8000 }));
  const stop = startPageScrollRestoration();
  b.frame();
  assert.equal(b.window.scrollY, 4200);
  b.expire();
  b.resize(10000);
  b.frame();
  assert.equal(b.window.scrollY, 4200);
  assert.equal(b.saved().y, 4200);
  stop();
});
