import { useState } from 'react';
import type { AnalysisResult, ApiSettings } from './types/analysis';
import { analyzeSentence } from './services/ai';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ColorAnnotation from './components/ColorAnnotation';
import TreeView from './components/TreeView';
import SettingsPanel, { loadSettings } from './components/SettingsPanel';

export default function App() {
  const [settings, setSettings] = useState<ApiSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (sentence: string) => {
    if (!settings.apiKey) {
      setSettingsOpen(true);
      setError('请先配置 API Key');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSentence(sentence, settings);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <InputPanel onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <span className="ml-3 text-gray-500">AI 正在分析句子结构...</span>
          </div>
        )}

        {result && (
          <>
            {/* Patterns */}
            {result.patterns.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">识别到的句式</h2>
                <div className="flex flex-wrap gap-2">
                  {result.patterns.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-sm"
                      title={p.description}
                    >
                      {p.name}
                      <span className="text-indigo-400 ml-1.5 text-xs">{p.description}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ColorAnnotation tokens={result.tokens} translation={result.fullTranslation} />
            <TreeView tree={result.tree} />
          </>
        )}
      </main>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}
