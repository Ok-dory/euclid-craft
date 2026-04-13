'use client';

import { Card } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import { CardIcon } from './CardIcons';

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

interface CardItemProps {
  card: Card;
  isUnlocked: boolean;
  isSelected: boolean;
  compact?: boolean;
}

export default function CardItem({ card, isUnlocked, isSelected, compact = false }: CardItemProps) {
  const { addToSlot, removeFromSlot } = useGameStore();

  const handleClick = () => {
    if (!isUnlocked) return;
    if (isSelected) {
      removeFromSlot(card.id);
    } else {
      addToSlot(card.id);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        title={card.nameKo}
        className={`
          relative rounded-lg border transition-all duration-150 cursor-pointer
          flex items-center justify-center
          w-12 h-12 shrink-0
          ${isSelected
            ? 'border-[#c9a84c] bg-[#c9a84c]/10 shadow-[0_0_8px_#c9a84c44]'
            : 'border-[#2a2a3e] bg-[#1e1e2e] hover:border-[#c9a84c]/40'}
        `}
      >
        <div className="w-8 h-8">
          <CardIcon type={card.type} />
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!isUnlocked}
      className={`
        relative rounded-xl border transition-all duration-200 text-left w-full
        flex flex-col overflow-hidden group
        ${isUnlocked ? 'cursor-pointer' : 'cursor-default opacity-40'}
        ${isSelected
          ? 'border-[#c9a84c] shadow-[0_0_16px_#c9a84c33] bg-[#1e1e2e]'
          : isUnlocked
            ? 'border-[#2a2a3e] bg-[#1e1e2e] hover:border-[#c9a84c]/50 hover:shadow-[0_0_12px_#c9a84c22]'
            : 'border-[#2a2a3e] bg-[#161622]'}
      `}
    >
      {/* Gold selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#c9a84c] shadow-[0_0_6px_#c9a84c]" />
      )}

      {/* Image area */}
      <div className="relative w-full aspect-square bg-[#12121e] flex items-center justify-center p-4">
        {isUnlocked ? (
          <div className="w-full h-full max-w-[72px] max-h-[72px]">
            <CardIcon type={card.type} />
          </div>
        ) : (
          <div className="text-3xl opacity-30">?</div>
        )}
      </div>

      {/* Card info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded border w-fit ${TYPE_COLORS[card.type]}`}>
          {TYPE_LABELS[card.type]}
        </span>
        <p className="text-[#ffffff] text-sm font-medium leading-tight mt-1 line-clamp-2">
          {isUnlocked ? card.nameKo : '???'}
        </p>
        {isUnlocked && (
          <p className="text-[#a0a0a0] text-xs leading-snug line-clamp-2 mt-0.5">
            {card.descriptionKo}
          </p>
        )}
      </div>
    </button>
  );
}
