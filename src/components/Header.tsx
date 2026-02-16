interface HeaderProps {
  onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          SL
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">SentenceLens</h1>
          <p className="text-xs text-gray-500">英语长难句分析工具</p>
        </div>
      </div>
      <button
        onClick={onOpenSettings}
        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      >
        Settings
      </button>
    </header>
  );
}
