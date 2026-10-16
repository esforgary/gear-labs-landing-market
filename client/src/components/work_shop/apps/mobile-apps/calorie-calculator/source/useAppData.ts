import { useCallback, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { AppData, WalkEntry } from './types';
import { createInitialData } from './seed';
import { isFoodIconCategory } from './foodCategories';
import { activityValidationError, isActivityKind } from './activity';

const record = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const text = (value: unknown): value is string => typeof value === 'string';
const image = (value: unknown) => value === undefined || (text(value) && value.length <= 480000
  && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value));
const nutrients = (value: unknown) => record(value) && ['kcal', 'protein', 'fat', 'carbs', 'fiber'].every(key => finite(value[key]) && value[key] >= 0);
const category = (value: unknown) => value === undefined || isFoodIconCategory(value);
const unitWeight = (value: unknown) => value === undefined || (finite(value) && value > 0 && value <= 5000);
const foodQuantity = (value: unknown) => value === undefined || (record(value)
  && (value.unit === 'serving' || value.unit === 'piece') && finite(value.amount) && value.amount > 0);
const themeColors = (value: unknown) => record(value)
  && ['accent', 'background', 'surface'].every(key => text(value[key]) && /^#[0-9a-fA-F]{6}$/.test(value[key]));
const listOf = (value: unknown, check: (item: Record<string, unknown>) => boolean) => Array.isArray(value) && value.every(item => record(item) && check(item));
const themePresets = (value: unknown) => {
  if (value === undefined) return true;
  const ids = new Set<string>();
  const names = new Set<string>();
  return listOf(value, item => {
    if (!text(item.id) || !item.id.trim() || !text(item.name) || !themeColors(item.colors)) return false;
    const name = item.name.trim().toLowerCase();
    if (!name || item.name.trim().length > 40 || ids.has(item.id) || names.has(name)) return false;
    ids.add(item.id);
    names.add(name);
    return true;
  });
};

/** Validate storage/imported JSON before the interface performs calculations on it. */
export function isAppData(value: unknown): value is AppData {
  if (!record(value) || value.version !== 1 || !record(value.profile) || !record(value.water)) return false;
  const p = value.profile;
  return text(p.name) && ['female', 'male'].includes(String(p.sex)) && ['lose', 'lose_fast', 'maintain'].includes(String(p.goal))
    && (value.theme === undefined || themeColors(value.theme)) && themePresets(value.themePresets)
    && typeof p.configured === 'boolean'
    && ['age', 'height', 'weight', 'targetWeight', 'activity', 'stepsGoal', 'stride'].every(key => finite(p[key]))
    && Object.values(value.water).every(amount => finite(amount) && amount >= 0)
    && listOf(value.products, item => text(item.id) && text(item.name) && text(item.category) && text(item.emoji) && nutrients(item)
      && image(item.image) && category(item.iconCategory) && (item.note === undefined || text(item.note))
      && unitWeight(item.servingGrams) && unitWeight(item.pieceGrams))
    && listOf(value.recipes, item => text(item.id) && text(item.name) && text(item.emoji) && finite(item.servings) && item.servings > 0
      && finite(item.cookedWeight) && item.cookedWeight >= 0 && unitWeight(item.pieceGrams) && category(item.iconCategory)
      && listOf(item.ingredients, ingredient => text(ingredient.productId) && finite(ingredient.grams) && ingredient.grams >= 0))
    && listOf(value.food, item => text(item.id) && text(item.name) && text(item.date) && text(item.emoji) && finite(item.grams) && item.grams >= 0
      && ['breakfast', 'lunch', 'dinner', 'snack'].includes(String(item.meal)) && nutrients(item.nutrients) && image(item.image) && category(item.iconCategory)
      && (item.productId === undefined || text(item.productId)) && foodQuantity(item.quantity))
    && listOf(value.walks, item => text(item.id) && text(item.date) && text(item.time) && ['easy', 'moderate', 'brisk'].includes(String(item.pace))
      && ['minutes', 'steps', 'distance', 'weight'].every(key => finite(item[key]) && item[key] >= 0)
      && (item.kind === undefined || (isActivityKind(item.kind) && activityValidationError(item as unknown as WalkEntry) === null)))
    && listOf(value.sleep, item => text(item.id) && text(item.date) && text(item.bedtime) && text(item.wakeTime) && finite(item.weight) && item.weight >= 0);
}


const STORAGE_KEY = 'gearlabs:calorie-calculator:diary:v1';
function readDiary(): { data: AppData; error: string | null; damaged: string | null } {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const data: unknown = JSON.parse(raw);
      if (!isAppData(data)) throw new Error('Invalid diary');
      return { data, error: null, damaged: null };
    }
  } catch {
    return { data: createInitialData(), damaged: raw, error: raw ? 'Сохранённые данные повреждены. При следующем сохранении будет создана резервная копия.' : 'Хранилище браузера недоступно. Скачайте дневник, чтобы сохранить записи.' };
  }
  return { data: createInitialData(), error: null, damaged: null };
}

export function useAppData() {
  const [initial] = useState(readDiary);
  const [data, setDataState] = useState(initial.data);
  const current = useRef(data);
  const damaged = useRef(initial.damaged);
  const [error, setError] = useState(initial.error);
  const persist = useCallback((next: AppData) => {
    try {
      if (damaged.current !== null) {
        localStorage.setItem(STORAGE_KEY + ':recovery:' + Date.now(), damaged.current);
        damaged.current = null;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setError(null);
    } catch {
      setError('Не удалось сохранить в браузере. Скачайте дневник на вкладке «Данные», пока приложение открыто.');
    }
  }, []);
  const setData: Dispatch<SetStateAction<AppData>> = useCallback(update => {
    const next = typeof update === 'function' ? update(current.current) : update;
    if (!isAppData(next)) { setError('Данные дневника имеют неверный формат.'); return; }
    current.current = next;
    setDataState(next);
    persist(next);
  }, [persist]);
  const retrySave = useCallback(() => persist(current.current), [persist]);
  return { data, setData, editable: true, error, retrySave, syncStatus: error ? 'Не сохранено' : 'На устройстве' };
}
