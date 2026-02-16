import { useState } from 'react';

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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        输入英语长难句
      </label>
      <textarea
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder="Type or paste an English sentence here..."
        className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading || !sentence.trim()}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {loading ? '分析中...' : '分析句子'}
        </button>
        <span className="text-xs text-gray-400">Ctrl+Enter</span>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">示例句子：</p>
        <div className="flex flex-col gap-2">
          {EXAMPLE_SENTENCES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setSentence(ex)}
              className="text-left text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-md transition-colors line-clamp-1 cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
