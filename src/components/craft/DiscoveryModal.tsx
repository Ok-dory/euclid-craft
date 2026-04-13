'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import cardsData from '@/data/cards.json';
import { CardIcon } from './CardIcons';

export default function DiscoveryModal() {
  const { combineResult, clearCombineResult, clearSlot } = useGameStore();

  const isOpen = !!combineResult;
  const isSuccess = combineResult?.success === true;
  const isAlreadyKnown = combineResult?.alreadyKnown === true;

  const discoveredCard = combineResult?.cardId
    ? cardsData.cards.find((c) => c.id === combineResult.cardId)
    : null;

  const handleClose = () => {
    clearCombineResult();
    if (!isSuccess) clearSlot();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-2xl border border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {isSuccess && discoveredCard ? (
              <>
                {/* Gold glow top */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

                {/* Sparkle header */}
                <motion.div
                  className="text-center pt-6 pb-2 px-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-[#c9a84c] text-xs font-semibold tracking-widest uppercase mb-1">
                    ✦ 새로운 발견 ✦
                  </p>
                  <h2 className="text-white text-xl font-bold leading-tight">
                    {discoveredCard.nameKo}
                  </h2>
                </motion.div>

                {/* Card image */}
                <motion.div
                  className="flex justify-center py-4 px-6"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                >
                  <div className="w-32 h-32 rounded-xl border border-[#c9a84c]/30 bg-[#12121e] flex items-center justify-center p-4 shadow-[0_0_24px_#c9a84c22]">
                    {discoveredCard && <CardIcon type={discoveredCard.type} />}
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div
                  className="px-6 pb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-[#a0a0a0] text-sm text-center leading-relaxed">
                    {discoveredCard.descriptionKo}
                  </p>
                </motion.div>

                {/* Character quote */}
                <motion.div
                  className="mx-6 mb-5 rounded-xl border border-[#2a2a3e] bg-[#12121e] px-4 py-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <p className="text-[#c9a84c] text-xs font-semibold mb-1">캐릭터 대사</p>
                  <p className="text-white text-sm leading-relaxed">
                    &ldquo;{discoveredCard.quote}&rdquo;
                  </p>
                </motion.div>

                {/* Button */}
                <motion.div
                  className="px-6 pb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-[#c9a84c] hover:bg-[#d4b560] active:bg-[#b8943a] text-[#0a0a0a] font-bold text-sm transition-colors duration-150"
                  >
                    확인
                  </button>
                </motion.div>
              </>
            ) : (
              /* Failure state */
              <>
                <div className="text-center py-8 px-6">
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✕
                  </motion.div>
                  <h2 className="text-white text-lg font-bold mb-2">
                    {isAlreadyKnown ? '이미 알고 있는 정리예요' : '조합 실패'}
                  </h2>
                  <p className="text-[#a0a0a0] text-sm">
                    {isAlreadyKnown
                      ? '이 정리는 이미 발견했어요. 다른 조합을 시도해보세요!'
                      : '이 조합으로는 새로운 정리를 발견할 수 없어요. 다시 시도해보세요!'}
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl border border-[#2a2a3e] hover:border-[#c9a84c]/50 text-white text-sm font-medium transition-colors duration-150"
                  >
                    닫기
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
