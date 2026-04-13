'use client';

import { Card } from '@/types';
import { CardIcon } from '@/components/craft/CardIcons';

const TYPE_LABELS: Record<string, string> = {
  axiom: '공리',
  postulate: '공준',
  theorem: '정리',
};

const TYPE_COLORS: Record<string, string> = {
  axiom: 'text-[#c9a84c] border-[#c9a84c]/30 bg-[#c9a84c]/10',
  postulate: 'text-[#7eb8d4] border-[#7eb8d4]/30 bg-[#7eb8d4]/10',
  theorem: 'text-[#a07ad4] border-[#a07ad4]/30 bg-[#a07ad4]/10',
};

interface CollectionCardProps {
  card: Card;
  isUnlocked: boolean;
  onClick: () => void;
}

export default function CollectionCard({ card, isUnlocked, onClick }: CollectionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-xl border transition-all duration-200 text-left w-full
        flex flex-col overflow-hidden group cursor-pointer
        ${isUnlocked
          ? 'border-[#2a2a3e] bg-[#1e1e2e] hover:border-[#c9a84c]/50 hover:shadow-[0_0_16px_#c9a84c22]'
          : 'border-[#2a2a3e] bg-[#12121e] opacity-45 hover:opacity-60'}
      `}
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-[#0d0d1a] flex items-center justify-center p-5">
        {isUnlocked ? (
          <div className="w-full h-full max-w-[80px] max-h-[80px] transition-transform duration-200 group-hover:scale-105">
            <CardIcon type={card.type} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <span className="text-4xl text-[#a0a0a0]">?</span>
          </div>
        )}

        {/* Unlocked glow dot */}
        {isUnlocked && (
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#c9a84c]/80" />
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border w-fit tracking-wide ${TYPE_COLORS[card.type]}`}>
          {TYPE_LABELS[card.type]}
        </span>

        <p className={`text-sm font-semibold leading-tight ${isUnlocked ? 'text-white' : 'text-[#a0a0a0]'}`}>
          {isUnlocked ? card.nameKo : '???'}
        </p>

        {isUnlocked ? (
          <p className="text-[#a0a0a0] text-[11px] leading-snug line-clamp-3 mt-0.5">
            {card.descriptionKo}
          </p>
        ) : (
          <p className="text-[#a0a0a0]/50 text-[11px] italic">
            아직 발견하지 못한 카드
          </p>
        )}
      </div>
    </button>
  );
}
