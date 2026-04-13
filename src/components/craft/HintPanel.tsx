'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { getHints, HintLevel } from '@/lib/hintEngine';

const LEVEL_LABELS: Record<HintLevel, string> = {
  1: '약한 힌트',
  2: '중간 힌트',
  3: '강한 힌트',
};

const LEVEL_COLORS: Record<HintLevel, string> = {
  1: 'text-[#7eb8d4] border-[#7eb8d4]/30 bg-[#7eb8d4]/5',
  2: 'text-[#c9a84c] border-[#c9a84c]/30 bg-[#c9a84c]/5',
  3: 'text-[#e07a7a] border-[#e07a7a]/30 bg-[#e07a7a]/5',
};

export default function HintPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [level, setLevel] = useState<HintLevel>(1);
  const [totalUsed, setTotalUsed] = useState(0);

  const { unlockedCards, discoveredRecipes } = useGameStore();
  const hintData = getHints(unlockedCards, discoveredRecipes);

  const currentHint = hintData.hints?.[level - 1] ?? null;
  const canGoDeeper = level < 3;

  const handleOpen = () => {
    setIsOpen(true);
    setLevel(1);
    setTotalUsed((n) => n + 1);
  };

  const handleMore = () => {
    if (!canGoDeeper) return;
    const next = (level + 1) as HintLevel;
    setLevel(next);
    setTotalUsed((n) => n + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLevel(1);
  };

  // All discovered → no hints needed
  if (hintData.undiscoveredCount === 0) {
    return (
      <div className="rounded-xl border border-[#2a2a3e] bg-[#12121e] px-4 py-3 text-center">
        <p className="text-[#c9a84c] text-xs">✦ 모든 정리를 발견했어요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Toggle button */}
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="w-full py-2.5 rounded-xl border border-[#2a2a3e] hover:border-[#7eb8d4]/40 text-[#a0a0a0] hover:text-[#7eb8d4] text-sm transition-all duration-150 flex items-center justify-center gap-2"
        >
          <span className="text-base">◎</span>
          <span>힌트 보기</span>
          {totalUsed > 0 && (
            <span className="text-[10px] text-[#a0a0a0]/60 ml-1">({totalUsed}회 사용)</span>
          )}
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            key="hint-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className={`rounded-xl border p-4 flex flex-col gap-3 ${LEVEL_COLORS[level]}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">◎</span>
                <span className="text-xs font-semibold">{LEVEL_LABELS[level]}</span>
                {/* Level dots */}
                <div className="flex gap-0.5 ml-1">
                  {([1, 2, 3] as HintLevel[]).map((l) => (
                    <span
                      key={l}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        l <= level
                          ? l === 1 ? 'bg-[#7eb8d4]' : l === 2 ? 'bg-[#c9a84c]' : 'bg-[#e07a7a]'
                          : 'bg-[#2a2a3e]'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-[#a0a0a0] hover:text-white text-xs transition-colors"
              >
                닫기
              </button>
            </div>

            {/* Hint message */}
            {hintData.hints === null ? (
              <p className="text-sm leading-relaxed">
                현재 보유 카드로 만들 수 있는 조합이 없어요. 더 많은 정리를 발견해보세요!
              </p>
            ) : (
              <p className="text-sm leading-relaxed">
                {currentHint?.message}
              </p>
            )}

            {/* Stats line */}
            <p className="text-[10px] opacity-60">
              미발견 정리 {hintData.undiscoveredCount}개 남음
              {totalUsed > 0 && ` · 힌트 ${totalUsed}회 사용`}
            </p>

            {/* More button */}
            {hintData.hints !== null && canGoDeeper && (
              <button
                onClick={handleMore}
                className="w-full py-2 rounded-lg border border-current/30 text-xs font-medium hover:bg-current/10 transition-colors"
              >
                더 자세한 힌트 →
              </button>
            )}

            {/* Max level message */}
            {level === 3 && (
              <p className="text-[10px] opacity-50 text-center">
                이게 최대 힌트예요. 직접 조합해보세요!
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
