import { useState, useRef, useEffect } from 'react';
import type { TokenAnnotation, GrammarRole } from '../types/analysis';
import { getRoleColor, posLabels } from '../utils/colors';

interface TooltipData {
  token: TokenAnnotation;
  rect: DOMRect;
}

interface ColorAnnotationProps {
  tokens: TokenAnnotation[];
  translation: string;
  disabledRoles?: Set<GrammarRole>;
}

export default function ColorAnnotation({ tokens, translation, disabledRoles }: ColorAnnotationProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (token: TokenAnnotation, e: React.MouseEvent) => {
    if (token.role === 'punctuation') return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setTooltip({ token, rect });
  };

  const handleMouseLeave = () => setTooltip(null);

  // Adjust tooltip position to stay within viewport
  useEffect(() => {
    if (!tooltip || !tooltipRef.current) return;
    const el = tooltipRef.current;
    const viewportWidth = window.innerWidth;
    const elRect = el.getBoundingClientRect();
    if (elRect.right > viewportWidth - 8) {
      el.style.left = `${viewportWidth - elRect.width - 8}px`;
      el.style.transform = 'translateY(0)';
    }
    if (elRect.left < 8) {
      el.style.left = '8px';
      el.style.transform = 'translateY(0)';
    }
  }, [tooltip]);

  // Decoration color mapping for wavy underline
  const getDecorationColor = (role: GrammarRole): string => {
    const map: Record<string, string> = {
      subject: 'decoration-rose-400',
      predicate: 'decoration-emerald-400',
      object: 'decoration-sky-400',
      complement: 'decoration-teal-400',
      attributive: 'decoration-amber-400',
      adverbial: 'decoration-orange-400',
      clause: 'decoration-violet-400',
      connector: 'decoration-stone-400',
    };
    return map[role] || 'decoration-stone-400';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8" ref={containerRef}>
      <h2 className="text-lg font-semibold text-stone-800 mb-4">颜色标注</h2>

      {/* Annotated sentence */}
      <div className="font-serif-display text-lg md:text-xl leading-10 tracking-wide flex flex-wrap gap-1 items-baseline">
        {tokens.map((token, i) => {
          const color = getRoleColor(token.role);
          const disabled = disabledRoles?.has(token.role);

          if (token.role === 'punctuation') {
            return (
              <span key={i} className="text-stone-400">
                {token.text}
              </span>
            );
          }
          return (
            <span
              key={i}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-all ${color.bg} ${color.text} hover:underline hover:decoration-wavy hover:decoration-2 ${getDecorationColor(token.role)} ${
                disabled ? 'opacity-30' : ''
              }`}
              onMouseEnter={(e) => handleMouseEnter(token, e)}
              onMouseLeave={handleMouseLeave}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Translation */}
      <div className="mt-6 border-l-4 border-amber-400 pl-4 py-2 bg-amber-50/50 rounded-r-md">
        <p className="text-sm text-stone-500 mb-1">中文翻译</p>
        <p className="text-base text-stone-800">{translation}</p>
      </div>

      {/* Tooltip - light annotation card below token */}
      {tooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-stone-200 p-4 pointer-events-none animate-fade-in-up"
          style={{
            left: tooltip.rect.left + tooltip.rect.width / 2,
            top: tooltip.rect.bottom + 8,
            transform: 'translateX(-50%)',
            minWidth: '180px',
          }}
        >
          <div className="font-serif-display text-lg font-semibold text-stone-800 mb-2">
            {tooltip.token.text}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-500 mb-2">
            <span>词性</span>
            <span className="text-stone-700 font-medium">{posLabels[tooltip.token.pos] ?? tooltip.token.pos}</span>
            <span>成分</span>
            <span className={`font-medium ${getRoleColor(tooltip.token.role).text}`}>
              {getRoleColor(tooltip.token.role).label}
            </span>
          </div>
          <div className="bg-amber-50 text-amber-800 px-2 py-1 rounded text-sm">
            {tooltip.token.meaning}
          </div>
        </div>
      )}
    </div>
  );
}
