'use client';

import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import CardItem from './CardItem';
import cardsData from '@/data/cards.json';
import type { CardType } from '@/types';

const TABS: { label: string; value: CardType | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '공리', value: 'axiom' },
  { label: '공준', value: 'postulate' },
  { label: '정리', value: 'theorem' },
];

export default function CardGrid() {
  const [activeTab, setActiveTab] = useState<CardType | 'all'>('all');
  const { unlockedCards, selectedCards } = useGameStore();

  const allCards = cardsData.cards;
  const filteredCards = activeTab === 'all'
    ? allCards
    : allCards.filter((c) => c.type === activeTab);

  const unlockedCount = unlockedCards.length;
  const totalCount = allCards.length;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-[#c9a84c] font-semibold text-sm tracking-wider uppercase">
          카드 목록
        </h2>
        <span className="text-[#a0a0a0] text-xs">
          {unlockedCount} / {totalCount} 발견
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-[#2a2a3e] overflow-hidden shrink-0">
        <div
          className="h-full rounded-full bg-[#c9a84c] transition-all duration-500"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
              ${activeTab === tab.value
                ? 'bg-[#c9a84c] text-[#0a0a0a]'
                : 'text-[#a0a0a0] hover:text-white border border-[#2a2a3e] hover:border-[#c9a84c]/40'}
            `}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1 opacity-70">
                {allCards.filter((c) => c.type === tab.value && unlockedCards.includes(c.id)).length}
                /{allCards.filter((c) => c.type === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
          {filteredCards.map((card) => {
            const isUnlocked = unlockedCards.includes(card.id);
            const isSelected = selectedCards.includes(card.id);
            return (
              <CardItem
                key={card.id}
                card={card as import('@/types').Card}
                isUnlocked={isUnlocked}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
