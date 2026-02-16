import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ApiSettings } from '../types/analysis';
import { saveSettings } from '../utils/settings';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSettingsChange: (s: ApiSettings) => void;
}

export default function SettingsPanel({ open, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const [local, setLocal] = useState<ApiSettings>(settings);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const handleSave = () => {
    saveSettings(local);
    onSettingsChange(local);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-stone-800">API 设置</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">API Key</label>
              <input
                type="password"
                value={local.apiKey}
                onChange={(e) => setLocal({ ...local, apiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">API Base URL</label>
              <input
                type="text"
                value={local.baseUrl}
                onChange={(e) => setLocal({ ...local, baseUrl: e.target.value })}
                placeholder="https://api.openai.com"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
              />
              <p className="text-xs text-stone-400 mt-1.5">支持 OpenAI 兼容 API，如 https://api.openai.com</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">模型</label>
              <input
                type="text"
                value={local.model}
                onChange={(e) => setLocal({ ...local, model: e.target.value })}
                placeholder="gpt-4o"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
              />
              <p className="text-xs text-stone-400 mt-1.5">例如: gpt-4o, gpt-4o-mini, gpt-3.5-turbo</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 text-sm text-white bg-slate-700 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
