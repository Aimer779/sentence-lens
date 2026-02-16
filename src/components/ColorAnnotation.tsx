import { useState } from 'react';
import type { TokenAnnotation } from '../types/analysis';
import { roleColors, posLabels } from '../utils/colors';

interface TooltipData {
  token: TokenAnnotation;
  x: number;
  y: number;
}

interface ColorAnnotationProps {
  tokens: TokenAnnotation[];
  translation: string;
}

export default function ColorAnnotation({ tokens, translation }: ColorAnnotationProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const handleMouseEnter = (token: TokenAnnotation, e: React.MouseEvent) => {
    if (token.role === 'punctuation') return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({ token, x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">颜色标注</h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        {Object.entries(roleColors)
          .filter(([key]) => key !== 'punctuation')
          .map(([key, val]) => (
            <span key={key} className={`px-2 py-1 rounded ${val.bg} ${val.text} border ${val.border}`}>
              {val.label}
            </span>
          ))}
      </div>

      {/* Annotated sentence */}
      <div className="leading-relaxed text-lg flex flex-wrap gap-0.5 items-baseline">
        {tokens.map((token, i) => {
          const color = roleColors[token.role];
          if (token.role === 'punctuation') {
            return (
              <span key={i} className="text-gray-500">
                {token.text}
              </span>
            );
          }
          return (
            <span
              key={i}
              className={`px-1.5 py-0.5 rounded cursor-pointer border transition-all hover:shadow-md ${color.bg} ${color.text} ${color.border}`}
              onMouseEnter={(e) => handleMouseEnter(token, e)}
              onMouseLeave={handleMouseLeave}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Translation */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-1">中文翻译</p>
        <p className="text-base text-gray-800">{translation}</p>
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white rounded-lg px-4 py-3 text-sm shadow-xl pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="font-medium text-base mb-1">{tooltip.token.text}</div>
          <div className="flex gap-3 text-xs text-gray-300">
            <span>词性: {posLabels[tooltip.token.pos] ?? tooltip.token.pos}</span>
            <span>成分: {roleColors[tooltip.token.role].label}</span>
          </div>
          <div className="mt-1 text-yellow-200">{tooltip.token.meaning}</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-900" />
        </div>
      )}
    </div>
  );
}
