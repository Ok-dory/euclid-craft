import cardsData from '@/data/cards.json';
import recipesData from '@/data/recipes.json';

export type HintLevel = 1 | 2 | 3;

export interface HintContent {
  level: HintLevel;
  message: string;
  highlightCardId?: string; // level 3: the revealed card
}

export interface HintEngineResult {
  availableCount: number;   // recipes completable right now (all inputs owned, output not yet found)
  undiscoveredCount: number; // total recipes not yet found
  hints: [HintContent, HintContent, HintContent] | null;
}

export function getHints(
  unlockedCards: string[],
  discoveredRecipes: string[]
): HintEngineResult {
  const unlockedSet = new Set(unlockedCards);

  // Recipes whose output is not yet unlocked
  const undiscovered = recipesData.recipes.filter(
    (r) => !unlockedSet.has(r.output)
  );

  // Recipes where every input is already owned
  const available = undiscovered.filter((r) =>
    r.inputs.every((id) => unlockedSet.has(id))
  );

  if (available.length === 0) {
    return {
      availableCount: 0,
      undiscoveredCount: undiscovered.length,
      hints: null,
    };
  }

  // Pick the best candidate: fewest inputs first (easiest to find by trial)
  const target = available.reduce((best, r) =>
    r.inputs.length < best.inputs.length ? r : best
  );

  const outputCard = cardsData.cards.find((c) => c.id === target.output)!;
  const inputCards = target.inputs
    .map((id) => cardsData.cards.find((c) => c.id === id)!)
    .filter(Boolean);

  // Collect input types for level 2 hint
  const typeCountMap: Record<string, number> = {};
  for (const card of inputCards) {
    typeCountMap[card.type] = (typeCountMap[card.type] ?? 0) + 1;
  }
  const typeLabels: Record<string, string> = {
    axiom: '공리',
    postulate: '공준',
    theorem: '정리',
  };
  const typeParts = Object.entries(typeCountMap).map(
    ([type, count]) => `${typeLabels[type]} ${count}장`
  );

  // Level 3: reveal a non-theorem card if possible (more specific clue)
  const revealCard =
    inputCards.find((c) => c.type !== 'theorem') ?? inputCards[0];

  return {
    availableCount: available.length,
    undiscoveredCount: undiscovered.length,
    hints: [
      {
        level: 1,
        message: `현재 보유 카드로 만들 수 있는 조합이 ${available.length}개 있어요!`,
      },
      {
        level: 2,
        message: `${typeParts.join(' + ')}을 조합해보세요. 총 ${target.inputs.length}장이 필요해요.`,
      },
      {
        level: 3,
        message: `"${revealCard.nameKo}"(${typeLabels[revealCard.type]}) 카드가 핵심이에요!`,
        highlightCardId: revealCard.id,
      },
    ],
  };
}
