'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/types';
import CardImage from '@/components/craft/CardImage';
import cardsData from '@/data/cards.json';
import recipesData from '@/data/recipes.json';

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

const TYPE_DOT: Record<string, string> = {
  axiom: 'bg-[#c9a84c]',
  postulate: 'bg-[#7eb8d4]',
  theorem: 'bg-[#a07ad4]',
};

const INITIAL_CARDS = new Set(['axiom_1','axiom_2','axiom_3','axiom_4','axiom_5','postulate_1','postulate_2','postulate_3','postulate_4','postulate_5']);

interface CardDetailModalProps {
  card: Card | null;
  isUnlocked: boolean;
  onClose: () => void;
}

function InputCardPill({ cardId }: { cardId: string }) {
  const card = cardsData.cards.find((c) => c.id === cardId);
  if (!card) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#2a2a3e] bg-[#0d0d1a] px-3 py-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_DOT[card.type]}`} />
      <div className="min-w-0">
        <p className="text-white text-xs font-medium truncate">{card.nameKo}</p>
        <p className="text-[#a0a0a0] text-[10px]">{TYPE_LABELS[card.type]}</p>
      </div>
    </div>
  );
}

export default function CardDetailModal({ card, isUnlocked, onClose }: CardDetailModalProps) {
  const recipe = card ? recipesData.recipes.find((r) => r.output === card.id) : null;
  const isInitialCard = card ? INITIAL_CARDS.has(card.id) : false;

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden shadow-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          >
            {/* Top accent line */}
            {isUnlocked && (
              <div className={`h-0.5 w-full ${
                card.type === 'postulate'
                  ? 'bg-gradient-to-r from-transparent via-[#7eb8d4] to-transparent'
                  : card.type === 'theorem'
                    ? 'bg-gradient-to-r from-transparent via-[#a07ad4] to-transparent'
                    : 'bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent'
              }`} />
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full border border-[#2a2a3e] bg-[#12121e] flex items-center justify-center text-[#a0a0a0] hover:text-white transition-colors text-sm z-10"
            >
              ✕
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex gap-4 mb-5">
                {/* Card image */}
                <div className="w-20 shrink-0 rounded-xl border border-[#2a2a3e] bg-[#0d0d1a] overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  {isUnlocked ? (
                    <CardImage
                      imageUrl={card.imageUrl}
                      type={card.type}
                      alt={card.nameKo}
                      iconClassName="p-3"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl text-[#a0a0a0] opacity-30">?</span>
                    </div>
                  )}
                </div>

                {/* Name & type */}
                <div className="flex flex-col justify-center gap-2 min-w-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border w-fit tracking-wide ${TYPE_COLORS[card.type]}`}>
                    {TYPE_LABELS[card.type]}
                  </span>
                  <h2 className="text-white text-lg font-bold leading-tight">
                    {isUnlocked ? card.nameKo : '???'}
                  </h2>
                  {isUnlocked && (
                    <p className="text-[#a0a0a0] text-[11px] leading-tight">{card.name}</p>
                  )}
                </div>
              </div>

              {isUnlocked ? (
                <>
                  {/* Description */}
                  <div className="rounded-xl border border-[#2a2a3e] bg-[#12121e] p-4 mb-4">
                    <p className="text-[#a0a0a0] text-xs font-semibold mb-2 uppercase tracking-wide">명제</p>
                    <p className="text-white text-sm leading-relaxed">{card.descriptionKo}</p>
                  </div>

                  {/* Quote */}
                  <div className="rounded-xl border border-[#2a2a3e] bg-[#12121e] p-4 mb-4">
                    <p className="text-[#c9a84c] text-xs font-semibold mb-2">✦ 캐릭터 대사</p>
                    <p className="text-white text-sm leading-relaxed italic">&ldquo;{card.quote}&rdquo;</p>
                  </div>

                  {/* Recipe / Origin */}
                  <div className="rounded-xl border border-[#2a2a3e] bg-[#12121e] p-4">
                    <p className="text-[#a0a0a0] text-xs font-semibold mb-3 uppercase tracking-wide">
                      {isInitialCard ? '획득 방법' : '발견 레시피'}
                    </p>

                    {isInitialCard ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#c9a84c] text-sm">⬡</span>
                        <p className="text-[#a0a0a0] text-sm">게임 시작 시 기본 보유 카드</p>
                      </div>
                    ) : recipe ? (
                      <div className="flex flex-col gap-2">
                        {recipe.inputs.map((inputId) => (
                          <InputCardPill key={inputId} cardId={inputId} />
                        ))}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-px bg-[#2a2a3e]" />
                          <span className="text-[#a0a0a0] text-xs">→ 조합</span>
                          <div className="flex-1 h-px bg-[#2a2a3e]" />
                        </div>
                        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${TYPE_COLORS[card.type]}`}>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_DOT[card.type]}`} />
                          <p className="text-sm font-semibold">{card.nameKo}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[#a0a0a0] text-sm">레시피 정보 없음</p>
                    )}
                  </div>
                </>
              ) : (
                /* Locked state */
                <div className="rounded-xl border border-[#2a2a3e] bg-[#12121e] p-6 text-center">
                  <p className="text-[#a0a0a0] text-sm mb-2">아직 발견하지 못한 카드예요.</p>
                  <p className="text-[#a0a0a0]/60 text-xs">
                    크래프팅 보드에서 공리와 정리를 조합해<br />이 카드를 발견해보세요!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-[#2a2a3e] hover:border-[#c9a84c]/40 text-[#a0a0a0] hover:text-white text-sm font-medium transition-colors duration-150"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
