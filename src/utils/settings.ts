import type { ApiSettings } from '../types/analysis';

const STORAGE_KEY = 'sentence-lens-settings';

export const DEFAULT_SETTINGS: ApiSettings = {
  apiKey: '',
  baseUrl: 'https://api.openai.com',
  model: 'gpt-4o',
};

export function loadSettings(): ApiSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: ApiSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
