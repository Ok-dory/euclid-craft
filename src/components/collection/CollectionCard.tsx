'use client';

import { Card } from '@/types';
import { CardIcon } from '@/components/craft/CardIcons';
import CardImage from '@/components/craft/CardImage';

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
      {/* Image area — portrait 3:4 */}
      <div className="relative w-full aspect-[3/4] bg-[#0d0d1a]">
        {isUnlocked ? (
          <div className="absolute inset-0 transition-transform duration-200 group-hover:scale-105">
            <CardImage
              imageUrl={card.imageUrl}
              type={card.type}
              alt={card.nameKo}
              iconClassName="p-5"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <span className="text-4xl text-[#a0a0a0]">?</span>
          </div>
        )}

        {/* Unlocked glow dot */}
        {isUnlocked && (
          <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#c9a84c]/80 z-10" />
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
