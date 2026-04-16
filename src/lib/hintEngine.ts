import cardsData from '@/data/cards.json';
import recipesData from '@/data/recipes.json';

export type HintLevel = 1 | 2 | 3 | 4 | 5;

export interface HintContent {
  level: HintLevel;
  message: string;
  highlightCardId?: string; // level 3
  revealedCardName?: string; // level 4
  fullRecipe?: { inputs: string[]; output: string }; // level 5
}

export interface HintEngineResult {
  availableCount: number;
  undiscoveredCount: number;
  hints: [HintContent, HintContent, HintContent, HintContent, HintContent] | null;
}

const TYPE_LABELS: Record<string, string> = {
  axiom: '공리',
  postulate: '공준',
  theorem: '정리',
};

export function getHints(
  unlockedCards: string[],
  discoveredRecipes: string[]
): HintEngineResult {
  const unlockedSet = new Set(unlockedCards);

  const undiscovered = recipesData.recipes.filter(
    (r) => !unlockedSet.has(r.output)
  );

  const available = undiscovered.filter((r) =>
    r.inputs.every((id) => unlockedSet.has(id))
  );

  if (available.length === 0) {
    return { availableCount: 0, undiscoveredCount: undiscovered.length, hints: null };
  }

  // 최적 후보: 입력 수 가장 적은 것 (가장 찾기 쉬운 조합)
  const target = available.reduce((best, r) =>
    r.inputs.length < best.inputs.length ? r : best
  );

  const outputCard = cardsData.cards.find((c) => c.id === target.output)!;
  const inputCards = target.inputs
    .map((id) => cardsData.cards.find((c) => c.id === id)!)
    .filter(Boolean);

  // 레벨 2: 타입 구성
  const typeCountMap: Record<string, number> = {};
  for (const card of inputCards) {
    typeCountMap[card.type] = (typeCountMap[card.type] ?? 0) + 1;
  }
  const typeParts = Object.entries(typeCountMap).map(
    ([type, count]) => `${TYPE_LABELS[type]} ${count}장`
  );

  // 레벨 3: 핵심 카드 1장 (정리 카드보다 공리/공준 우선)
  const revealCard =
    inputCards.find((c) => c.type !== 'theorem') ?? inputCards[0];

  // 레벨 5: 전체 조합
  const inputNames = inputCards.map((c) => c.nameKo);

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
        message: `"${revealCard.nameKo}"(${TYPE_LABELS[revealCard.type]}) 카드가 핵심이에요!`,
        highlightCardId: revealCard.id,
      },
      {
        level: 4,
        message: `"${outputCard.nameKo}"을(를) 발견할 수 있어요!`,
        revealedCardName: outputCard.nameKo,
      },
      {
        level: 5,
        message: `${inputNames.join(' + ')} → ${outputCard.nameKo}`,
        fullRecipe: { inputs: target.inputs, output: target.output },
      },
    ],
  };
}
