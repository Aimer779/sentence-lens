import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { ClauseNode } from '../types/analysis';
import { roleColors } from '../utils/colors';

interface TreeNodeProps {
  node: ClauseNode;
  depth: number;
}

function TreeNode({ node, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const roleColor = node.role ? roleColors[node.role] : null;
  const borderColorClass = roleColor ? roleColor.border : 'border-stone-200';

  return (
    <div className={`${depth > 0 ? 'ml-4 md:ml-6' : ''}`}>
      <div
        className={`flex items-start gap-2 border-l-4 ${borderColorClass} bg-stone-50 hover:bg-stone-100 rounded-r-lg px-4 py-3 cursor-pointer transition-colors`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span className="text-stone-400 mt-0.5 flex-shrink-0 transition-transform duration-200">
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {!hasChildren && <span className="w-4 flex-shrink-0" />}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-stone-800">{node.label}</span>
            {node.role && roleColor && (
              <span className={`text-xs px-1.5 py-0.5 rounded ${roleColor.bg} ${roleColor.text}`}>
                {roleColor.label}
              </span>
            )}
            <span className="text-xs text-stone-400">
              {node.type === 'main_clause' && '主句'}
              {node.type === 'subordinate_clause' && '从句'}
              {node.type === 'phrase' && '短语'}
              {node.type === 'component' && '成分'}
            </span>
          </div>
          <p className="text-sm text-stone-600 mt-1 break-words">{node.text}</p>
          {node.translation && (
            <p className="text-stone-500 text-xs mt-0.5">{node.translation}</p>
          )}
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="mt-2 space-y-2 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-stone-200">
          {node.children!.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeViewProps {
  tree: ClauseNode;
}

export default function TreeView({ tree }: TreeViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-lg font-semibold text-stone-800 mb-4">句法结构树</h2>
      <div className="space-y-2">
        <TreeNode node={tree} depth={0} />
      </div>
    </div>
  );
}
