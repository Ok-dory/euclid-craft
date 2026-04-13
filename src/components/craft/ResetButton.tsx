'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

export default function ResetButton() {
  const [open, setOpen] = useState(false);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleConfirm = () => {
    resetGame();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[#a0a0a0] hover:text-[#e07a7a] text-sm transition-colors flex items-center gap-1.5"
      >
        <span>↺</span>
        <span className="hidden sm:inline">처음부터</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              className="relative z-10 w-full max-w-xs rounded-2xl border border-[#2a2a3e] bg-[#1a1a2e] overflow-hidden shadow-2xl"
              initial={{ scale: 0.88, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#e07a7a] to-transparent" />

              <div className="p-6">
                <div className="text-center mb-5">
                  <p className="text-2xl mb-3">↺</p>
                  <h2 className="text-white text-base font-bold mb-2">처음부터 시작할까요?</h2>
                  <p className="text-[#a0a0a0] text-sm leading-relaxed">
                    모든 발견이 초기화됩니다.<br />
                    공리·공준 10장만 남고 정리는 모두 잠겨요.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleConfirm}
                    className="w-full py-2.5 rounded-xl bg-[#e07a7a] hover:bg-[#e88888] active:bg-[#c96060] text-white font-bold text-sm transition-colors duration-150"
                  >
                    초기화하기
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-[#2a2a3e] hover:border-[#c9a84c]/40 text-[#a0a0a0] hover:text-white text-sm transition-colors duration-150"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
