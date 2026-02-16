import { useState } from 'react';
import { Menu } from 'lucide-react';
import type { AnalysisResult, ApiSettings, GrammarRole } from './types/analysis';
import { analyzeSentence } from './services/ai';
import Sidebar, { ROLES } from './components/Sidebar';
import InputPanel from './components/InputPanel';
import ColorAnnotation from './components/ColorAnnotation';
import TreeView from './components/TreeView';
import SettingsPanel from './components/SettingsPanel';
import { loadSettings } from './utils/settings';

export default function App() {
  const [settings, setSettings] = useState<ApiSettings>(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [disabledRoles, setDisabledRoles] = useState<Set<GrammarRole>>(new Set());

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

  const handleToggleRole = (role: GrammarRole) => {
    setDisabledRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  };

  const handleToggleAllRoles = () => {
    setDisabledRoles((prev) => {
      if (prev.size >= ROLES.length) return new Set();
      return new Set(ROLES);
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur border-b border-stone-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-md text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-stone-800">SentenceLens</h1>
      </header>

      {/* Desktop sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar
          disabledRoles={disabledRoles}
          onToggleRole={handleToggleRole}
          onToggleAllRoles={handleToggleAllRoles}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <Sidebar
            disabledRoles={disabledRoles}
            onToggleRole={handleToggleRole}
            onToggleAllRoles={handleToggleAllRoles}
            onOpenSettings={() => { setSettingsOpen(true); setSidebarOpen(false); }}
            className="animate-slide-in-left relative z-10"
          />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 lg:px-8 pt-16 lg:pt-10 pb-10 space-y-8">
        <InputPanel onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="bg-red-50 text-red-700 px-5 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            {/* Patterns skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="h-5 w-32 animate-shimmer rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-8 w-24 animate-shimmer rounded" />
                <div className="h-8 w-20 animate-shimmer rounded" />
                <div className="h-8 w-28 animate-shimmer rounded" />
              </div>
            </div>
            {/* Annotation skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="h-5 w-24 animate-shimmer rounded mb-4" />
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-8 animate-shimmer rounded" style={{ width: `${40 + (((i * 37) % 60))}px` }} />
                ))}
              </div>
            </div>
            {/* Tree skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="h-5 w-28 animate-shimmer rounded mb-4" />
              <div className="space-y-2">
                <div className="h-14 animate-shimmer rounded" />
                <div className="h-12 animate-shimmer rounded ml-6" />
                <div className="h-12 animate-shimmer rounded ml-6" />
              </div>
            </div>
          </div>
        )}

        {result && (
          <>
            {/* Patterns */}
            {result.patterns.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-lg font-semibold text-stone-800 mb-3">识别到的句式</h2>
                <div className="flex flex-wrap gap-2">
                  {result.patterns.map((p, i) => (
                    <span
                      key={i}
                      className="bg-amber-50 text-amber-800 border border-amber-200 rounded-md px-3 py-2 text-sm"
                      title={p.description}
                    >
                      {p.name}
                      <span className="text-stone-500 text-xs ml-1.5">{p.description}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ColorAnnotation tokens={result.tokens} translation={result.fullTranslation} disabledRoles={disabledRoles} />
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
