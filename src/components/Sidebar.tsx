import { ScanText, Settings } from 'lucide-react';
import type { GrammarRole } from '../types/analysis';
import { roleColors, roleEnglishLabels } from '../utils/colors';

interface SidebarProps {
  disabledRoles: Set<GrammarRole>;
  onToggleRole: (role: GrammarRole) => void;
  onToggleAllRoles: () => void;
  onOpenSettings: () => void;
  className?: string;
}

export const ROLES = Object.keys(roleColors).filter((k) => k !== 'punctuation') as GrammarRole[];

export default function Sidebar({ disabledRoles, onToggleRole, onToggleAllRoles, onOpenSettings, className = '' }: SidebarProps) {
  const allDisabled = disabledRoles.size >= ROLES.length;
  return (
    <aside className={`w-70 bg-white border-r border-stone-200 sticky top-0 h-screen overflow-y-auto p-6 flex flex-col ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center text-white">
          <ScanText size={20} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-stone-800 leading-tight">SentenceLens</h1>
          <p className="text-[10px] uppercase tracking-widest text-stone-400">English Sentence Analyzer</p>
        </div>
      </div>

      {/* Legend & Filter */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider">Grammar Roles</h3>
          <button
            onClick={onToggleAllRoles}
            className="text-[10px] text-stone-400 hover:text-amber-700 transition-colors cursor-pointer uppercase tracking-wider"
          >
            {allDisabled ? 'Show All' : 'Hide All'}
          </button>
        </div>
        <div className="space-y-1">
          {ROLES.map((role) => {
            const color = roleColors[role];
            const disabled = disabledRoles.has(role);
            return (
              <button
                key={role}
                onClick={() => onToggleRole(role)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors cursor-pointer ${
                  disabled ? 'opacity-40' : 'hover:bg-stone-50'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${color.bg} border ${color.border} flex-shrink-0`} />
                <span className={`text-sm font-medium ${disabled ? 'text-stone-400' : 'text-stone-700'}`}>
                  {color.label}
                </span>
                <span className={`text-xs ${disabled ? 'text-stone-300' : 'text-stone-400'} ml-auto`}>
                  {roleEnglishLabels[role]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors mt-6 cursor-pointer"
      >
        <Settings size={16} />
        <span className="text-sm">API 设置</span>
      </button>
    </aside>
  );
}
