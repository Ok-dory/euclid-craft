import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CombineResult } from '@/types';
import cardsData from '@/data/cards.json';
import recipesData from '@/data/recipes.json';

const INITIAL_UNLOCKED = cardsData.cards
  .filter((c) => c.type === 'axiom' || c.type === 'postulate')
  .map((c) => c.id);

interface GameStore {
  unlockedCards: string[];
  selectedCards: string[];
  discoveredRecipes: string[];
  combineResult: CombineResult | null;
  combine: () => void;
  addToSlot: (cardId: string) => void;
  removeFromSlot: (cardId: string) => void;
  clearSlot: () => void;
  clearCombineResult: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      unlockedCards: INITIAL_UNLOCKED,
      selectedCards: [],
      discoveredRecipes: [],
      combineResult: null,

      combine: () => {
        const { selectedCards, unlockedCards, discoveredRecipes } = get();
        if (selectedCards.length === 0) return;

        const sorted = [...selectedCards].sort();

        const recipe = recipesData.recipes.find((r) => {
          const sortedInputs = [...r.inputs].sort();
          return (
            sortedInputs.length === sorted.length &&
            sortedInputs.every((id, i) => id === sorted[i])
          );
        });

        if (!recipe) {
          set({ combineResult: { success: false } });
          return;
        }

        if (unlockedCards.includes(recipe.output)) {
          set({ combineResult: { success: false, alreadyKnown: true, cardId: recipe.output } });
          return;
        }

        set({
          unlockedCards: [...unlockedCards, recipe.output],
          discoveredRecipes: [...discoveredRecipes, recipe.id],
          selectedCards: [],
          combineResult: { success: true, cardId: recipe.output },
        });
      },

      addToSlot: (cardId: string) => {
        const { selectedCards, unlockedCards } = get();
        if (!unlockedCards.includes(cardId)) return;
        if (selectedCards.includes(cardId)) return;
        if (selectedCards.length >= 10) return;
        set({ selectedCards: [...selectedCards, cardId] });
      },

      removeFromSlot: (cardId: string) => {
        set((state) => ({
          selectedCards: state.selectedCards.filter((id) => id !== cardId),
        }));
      },

      clearSlot: () => set({ selectedCards: [] }),

      clearCombineResult: () => set({ combineResult: null }),

      resetGame: () =>
        set({
          unlockedCards: INITIAL_UNLOCKED,
          discoveredRecipes: [],
          selectedCards: [],
          combineResult: null,
        }),
    }),
    {
      name: 'euclid-craft-save',
      partialize: (state) => ({
        unlockedCards: state.unlockedCards,
        discoveredRecipes: state.discoveredRecipes,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<GameStore>;
        return {
          ...currentState,
          ...persisted,
          // Always ensure initial cards are unlocked
          unlockedCards: [
            ...new Set([
              ...INITIAL_UNLOCKED,
              ...(persisted.unlockedCards ?? []),
            ]),
          ],
        };
      },
    }
  )
);
