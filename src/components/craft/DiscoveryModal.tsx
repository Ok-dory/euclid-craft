'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import cardsData from '@/data/cards.json';
import CardImage from './CardImage';

const TYPE_LABELS: Record<string, string> = {
  axiom: '공리',
  postulate: '공준',
  theorem: '정리',
};

const TYPE_COLORS: Record<string, string> = {
  axiom: 'text-[#c9a84c] border-[#c9a84c]/40 bg-[#c9a84c]/10',
  postulate: 'text-[#7eb8d4] border-[#7eb8d4]/40 bg-[#7eb8d4]/10',
  theorem: 'text-[#a07ad4] border-[#a07ad4]/40 bg-[#a07ad4]/10',
};

export default function DiscoveryModal() {
  const { combineResult, clearCombineResult, clearSlot } = useGameStore();

  const isOpen   = !!combineResult;
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
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={handleClose}
          />

          {isSuccess && discoveredCard ? (
            /* ── 성공 모달 ── */
            <motion.div
              className="relative z-10 w-full max-w-xs rounded-2xl border border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden shadow-2xl"
              initial={{ scale: 0.82, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 280 }}
            >
              {/* Top gold line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent z-10" />

              {/* ── 이미지 영역 (모달 상단 메인 비주얼) ── */}
              <motion.div
                className="relative w-full"
                style={{ aspectRatio: '3/4', maxHeight: '55vh' }}
                initial={{ scale: 1.04, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.4, ease: 'easeOut' }}
              >
                <CardImage
                  imageUrl={discoveredCard.imageUrl}
                  type={discoveredCard.type}
                  alt={discoveredCard.nameKo}
                  iconClassName="p-12"
                />

                {/* 이미지 위 그라데이션 오버레이 (하단 텍스트 가독성) */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1a1a2e] to-transparent" />

                {/* 배지 */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-widest ${TYPE_COLORS[discoveredCard.type]}`}>
                    {TYPE_LABELS[discoveredCard.type]}
                  </span>
                </div>

                {/* 발견 뱃지 */}
                <motion.div
                  className="absolute top-3 right-3 z-10"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', damping: 12 }}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c] text-[#0a0a0a] tracking-widest">
                    NEW
                  </span>
                </motion.div>
              </motion.div>

              {/* ── 텍스트 영역 ── */}
              <div className="px-5 pt-1 pb-5 flex flex-col gap-3">
                {/* 제목 */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-[#c9a84c] text-[10px] font-semibold tracking-widest uppercase mb-0.5">
                    ✦ 새로운 발견 ✦
                  </p>
                  <h2 className="text-white text-lg font-bold leading-tight">
                    {discoveredCard.nameKo}
                  </h2>
                  <p className="text-[#a0a0a0] text-[11px] mt-0.5 leading-snug">
                    {discoveredCard.descriptionKo}
                  </p>
                </motion.div>

                {/* 캐릭터 대사 */}
                <motion.div
                  className="rounded-xl border border-[#2a2a3e] bg-[#12121e] px-4 py-3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                >
                  <p className="text-[#c9a84c] text-[10px] font-semibold mb-1">캐릭터 대사</p>
                  <p className="text-white text-sm leading-relaxed">
                    &ldquo;{discoveredCard.quote}&rdquo;
                  </p>
                </motion.div>

                {/* 확인 버튼 */}
                <motion.button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-[#c9a84c] hover:bg-[#d4b560] active:bg-[#b8943a] text-[#0a0a0a] font-bold text-sm transition-colors duration-150"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  확인
                </motion.button>
              </div>
            </motion.div>

          ) : (
            /* ── 실패 모달 ── */
            <motion.div
              className="relative z-10 w-full max-w-xs rounded-2xl border border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden shadow-2xl"
              initial={{ scale: 0.88, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            >
              <div className="text-center py-8 px-6">
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.45 }}
                >
                  ✕
                </motion.div>
                <h2 className="text-white text-lg font-bold mb-2">
                  {isAlreadyKnown ? '이미 알고 있는 정리예요' : '조합 실패'}
                </h2>
                <p className="text-[#a0a0a0] text-sm leading-relaxed">
                  {isAlreadyKnown
                    ? '이 정리는 이미 발견했어요.\n다른 조합을 시도해보세요!'
                    : '이 조합으로는 새로운 정리를\n발견할 수 없어요.'}
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
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
