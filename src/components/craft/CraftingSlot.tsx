'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import cardsData from '@/data/cards.json';

const TYPE_LABELS: Record<string, string> = {
  axiom: '공리',
  postulate: '공준',
  theorem: '정리',
};

const TYPE_DOT: Record<string, string> = {
  axiom: 'bg-[#c9a84c]',
  postulate: 'bg-[#7eb8d4]',
  theorem: 'bg-[#a07ad4]',
};

export default function CraftingSlot() {
  const { selectedCards, combine, clearSlot } = useGameStore();

  const selectedCardData = selectedCards.map(
    (id) => cardsData.cards.find((c) => c.id === id)!
  ).filter(Boolean);

  return (
    <div className="flex flex-col gap-2 sm:gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[#c9a84c] font-semibold text-sm tracking-wider uppercase">
          조합 슬롯
        </h2>
        <span className="text-[#a0a0a0] text-xs">
          {selectedCards.length} / 4
        </span>
      </div>

      {/* Slot area */}
      <div
        className="flex-1 rounded-xl border border-dashed border-[#2a2a3e] bg-[#0d0d1a] p-3 min-h-0 overflow-y-auto flex flex-col gap-2"
      >
        {selectedCardData.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#a0a0a0] gap-2">
            <div className="text-3xl opacity-30">⬡</div>
            <p className="text-xs text-center">
              왼쪽에서 카드를 선택하세요<br />
              <span className="text-[#a0a0a0]/60">최대 4장까지 조합 가능</span>
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {selectedCardData.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 rounded-lg border border-[#2a2a3e] bg-[#1e1e2e] px-3 py-2 group"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_DOT[card.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{card.nameKo}</p>
                  <p className="text-[#a0a0a0] text-[10px]">{TYPE_LABELS[card.type]}</p>
                </div>
                <button
                  onClick={() => useGameStore.getState().removeFromSlot(card.id)}
                  className="text-[#a0a0a0] hover:text-white transition-colors text-xs opacity-0 group-hover:opacity-100 shrink-0"
                  aria-label="제거"
                >
                  ✕
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={combine}
          disabled={selectedCards.length === 0}
          className={`
            w-full py-2 sm:py-3 rounded-xl font-bold text-sm transition-all duration-150
            ${selectedCards.length > 0
              ? 'bg-[#c9a84c] hover:bg-[#d4b560] active:bg-[#b8943a] text-[#0a0a0a] shadow-[0_0_16px_#c9a84c33]'
              : 'bg-[#1e1e2e] text-[#a0a0a0] cursor-not-allowed border border-[#2a2a3e]'}
          `}
        >
          ✦ 조합하기
        </button>
        <button
          onClick={clearSlot}
          disabled={selectedCards.length === 0}
          className={`
            w-full py-1.5 sm:py-2.5 rounded-xl text-sm transition-all duration-150 border
            ${selectedCards.length > 0
              ? 'border-[#2a2a3e] hover:border-[#c9a84c]/40 text-[#a0a0a0] hover:text-white'
              : 'border-[#2a2a3e] text-[#a0a0a0]/40 cursor-not-allowed'}
          `}
        >
          초기화
        </button>
      </div>

    </div>
  );
}
