import { useState } from 'react';
import { Send } from 'lucide-react';

const EXAMPLE_SENTENCES = [
  'The book that I bought yesterday, which was recommended by my professor who has been teaching linguistics for over twenty years, turned out to be one of the most comprehensive guides to sentence structure that I have ever read.',
  'Not until the government introduced stricter regulations did the companies begin to take environmental protection seriously, which ultimately led to a significant reduction in industrial pollution across the region.',
  'What the researchers discovered after years of painstaking investigation was that the phenomenon, long considered to be an anomaly, could in fact be explained by a relatively simple mathematical model.',
];

interface InputPanelProps {
  onAnalyze: (sentence: string) => void;
  loading: boolean;
}

export default function InputPanel({ onAnalyze, loading }: InputPanelProps) {
  const [sentence, setSentence] = useState('');

  const handleSubmit = () => {
    const trimmed = sentence.trim();
    if (trimmed) onAnalyze(trimmed);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <label className="block text-sm font-medium text-stone-600 mb-3">
        输入英语长难句
      </label>
      <textarea
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder="Type or paste an English sentence here..."
        className="w-full h-32 md:h-40 px-0 py-3 border-0 border-b-2 border-stone-200 focus:border-amber-500 rounded-none bg-transparent text-lg md:text-xl font-serif-display text-stone-800 resize-none focus:outline-none transition-colors placeholder:text-stone-300"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
      />
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={loading || !sentence.trim()}
          className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Send size={16} />
          {loading ? '分析中...' : '分析句子'}
        </button>
        <span className="text-xs text-stone-400 hidden sm:inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px] font-mono">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded text-[10px] font-mono">Enter</kbd>
        </span>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-stone-500 mb-3 uppercase tracking-wider">示例句子</p>
        <div className="flex flex-col gap-2">
          {EXAMPLE_SENTENCES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setSentence(ex)}
              title={ex}
              className="text-left font-serif-display text-sm leading-6 text-stone-500 hover:text-amber-700 px-3 py-2 rounded-md transition-colors overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-amber-50/50 block w-full"
            >
              <span className="text-stone-400 mr-2">{i + 1}.</span>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
