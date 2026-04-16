'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { getHints, HintLevel } from '@/lib/hintEngine';
import cardsData from '@/data/cards.json';

const LEVEL_LABELS: Record<HintLevel, string> = {
  1: '약한 힌트',
  2: '중간 힌트',
  3: '강한 힌트',
  4: '초강력 힌트',
  5: '슈퍼 초강력 힌트',
};

const LEVEL_STYLE: Record<HintLevel, { panel: string; dot: string; btn: string }> = {
  1: { panel: 'text-[#7eb8d4] border-[#7eb8d4]/30 bg-[#7eb8d4]/5',  dot: 'bg-[#7eb8d4]',  btn: 'border-[#7eb8d4]/40 hover:bg-[#7eb8d4]/10' },
  2: { panel: 'text-[#c9a84c] border-[#c9a84c]/30 bg-[#c9a84c]/5',  dot: 'bg-[#c9a84c]',  btn: 'border-[#c9a84c]/40 hover:bg-[#c9a84c]/10' },
  3: { panel: 'text-[#e07a7a] border-[#e07a7a]/30 bg-[#e07a7a]/5',  dot: 'bg-[#e07a7a]',  btn: 'border-[#e07a7a]/40 hover:bg-[#e07a7a]/10' },
  4: { panel: 'text-[#b07ad4] border-[#b07ad4]/30 bg-[#b07ad4]/5',  dot: 'bg-[#b07ad4]',  btn: 'border-[#b07ad4]/40 hover:bg-[#b07ad4]/10' },
  5: { panel: 'text-[#ff8c42] border-[#ff8c42]/40 bg-[#ff8c42]/8',  dot: 'bg-[#ff8c42]',  btn: 'border-[#ff8c42]/40 hover:bg-[#ff8c42]/10' },
};

const MAX_LEVEL: HintLevel = 5;

export default function HintPanel() {
  const [isOpen, setIsOpen]     = useState(false);
  const [level, setLevel]       = useState<HintLevel>(1);
  const [totalUsed, setTotalUsed] = useState(0);

  const { unlockedCards, discoveredRecipes } = useGameStore();
  const prevDiscoveredLen = useRef(discoveredRecipes.length);

  // 새 조합 발견 시 힌트 자동 닫힘
  useEffect(() => {
    if (discoveredRecipes.length > prevDiscoveredLen.current) {
      setIsOpen(false);
      setLevel(1);
    }
    prevDiscoveredLen.current = discoveredRecipes.length;
  }, [discoveredRecipes.length]);

  const hintData    = getHints(unlockedCards, discoveredRecipes);
  const currentHint = hintData.hints?.[level - 1] ?? null;
  const canGoDeeper = level < MAX_LEVEL;
  const style       = LEVEL_STYLE[level];

  const handleOpen = () => {
    setIsOpen(true);
    setLevel(1);
    setTotalUsed((n) => n + 1);
  };

  const handleMore = () => {
    if (!canGoDeeper) return;
    setLevel((l) => (l + 1) as HintLevel);
    setTotalUsed((n) => n + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
    setLevel(1);
  };

  // 모든 정리 발견
  if (hintData.undiscoveredCount === 0) {
    return (
      <div className="rounded-xl border border-[#2a2a3e] bg-[#12121e] px-4 py-3 text-center">
        <p className="text-[#c9a84c] text-xs">✦ 모든 정리를 발견했어요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ── 닫힌 상태: 버튼 ── */
          <motion.button
            key="hint-btn"
            onClick={handleOpen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="w-full py-2.5 rounded-xl border border-[#2a2a3e] hover:border-[#7eb8d4]/40 text-[#a0a0a0] hover:text-[#7eb8d4] text-sm transition-all duration-150 flex items-center justify-center gap-2"
          >
            <span className="text-base">◎</span>
            <span>힌트 보기</span>
            {totalUsed > 0 && (
              <span className="text-[10px] text-[#a0a0a0]/60 ml-1">({totalUsed}회 사용)</span>
            )}
          </motion.button>
        ) : (
          /* ── 열린 상태: 패널 ── */
          <motion.div
            key="hint-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className={`rounded-xl border p-4 flex flex-col gap-3 ${style.panel}`}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">◎</span>
                <span className="text-xs font-semibold">{LEVEL_LABELS[level]}</span>
                {/* 5단계 점 */}
                <div className="flex gap-0.5 ml-1">
                  {([1, 2, 3, 4, 5] as HintLevel[]).map((l) => (
                    <span
                      key={l}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                        l <= level ? LEVEL_STYLE[l].dot : 'bg-[#2a2a3e]'
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

            {/* 힌트 텍스트 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {hintData.hints === null ? (
                  <p className="text-sm leading-relaxed">
                    현재 보유 카드로 만들 수 있는 조합이 없어요.
                  </p>
                ) : level === 5 && currentHint?.fullRecipe ? (
                  /* 슈퍼 초강력: 전체 조합 시각화 */
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-semibold mb-1 opacity-80">전체 조합 공개</p>
                    {currentHint.fullRecipe.inputs.map((id) => {
                      const c = cardsData.cards.find((x) => x.id === id);
                      return (
                        <div key={id} className="flex items-center gap-1.5 text-xs bg-current/10 rounded-lg px-2.5 py-1.5">
                          <span className="opacity-60">+</span>
                          <span className="font-medium">{c?.nameKo ?? id}</span>
                        </div>
                      );
                    })}
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-px bg-current/20" />
                      <span className="text-[10px] opacity-60">→ 결과</span>
                      <div className="flex-1 h-px bg-current/20" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs bg-current/20 rounded-lg px-2.5 py-1.5 font-bold">
                      <span>✦</span>
                      <span>{cardsData.cards.find((x) => x.id === currentHint.fullRecipe?.output)?.nameKo}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{currentHint?.message}</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* 통계 */}
            <p className="text-[10px] opacity-50">
              미발견 정리 {hintData.undiscoveredCount}개 남음
              {totalUsed > 0 && ` · 힌트 ${totalUsed}회 사용`}
            </p>

            {/* 더 보기 버튼 */}
            {hintData.hints !== null && canGoDeeper && (
              <button
                onClick={handleMore}
                className={`w-full py-2 rounded-lg border text-xs font-medium transition-colors ${style.btn}`}
              >
                {level === 4 ? '⚠ 전체 조합 공개 →' : '더 자세한 힌트 →'}
              </button>
            )}

            {level === MAX_LEVEL && (
              <p className="text-[10px] opacity-40 text-center">
                최대 힌트입니다. 이제 직접 조합해보세요!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
