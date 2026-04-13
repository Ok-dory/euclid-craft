export type CardType = 'axiom' | 'postulate' | 'theorem';

export interface Card {
  id: string;
  type: CardType;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  quote: string;
  imageUrl: string;
}

export interface Recipe {
  id: string;
  inputs: string[];
  output: string;
  hint: string;
}

export interface GameState {
  unlockedCards: string[];
  selectedCards: string[];
  discoveredRecipes: string[];
}

export interface CombineResult {
  success: boolean;
  cardId?: string;
  alreadyKnown?: boolean;
}
