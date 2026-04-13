'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGameStore } from '@/stores/gameStore';
import CollectionCard from '@/components/collection/CollectionCard';
import CardDetailModal from '@/components/collection/CardDetailModal';
import cardsData from '@/data/cards.json';
import type { Card, CardType } from '@/types';

const TABS: { label: string; value: CardType | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '공리', value: 'axiom' },
  { label: '공준', value: 'postulate' },
  { label: '정리', value: 'theorem' },
];

const SECTION_DESC: Record<string, string> = {
  axiom: '수학의 가장 기본적인 진리. 증명 없이 참으로 받아들이는 명제.',
  postulate: '기하학 작도의 기본 원리. 유클리드가 가정한 다섯 가지 규칙.',
  theorem: '공리와 공준으로부터 논리적으로 증명된 명제.',
};

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState<CardType | 'all'>('all');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const { unlockedCards } = useGameStore();

  const allCards = cardsData.cards as Card[];
  const filteredCards = activeTab === 'all' ? allCards : allCards.filter((c) => c.type === activeTab);

  const totalCount = allCards.length;
  const unlockedCount = unlockedCards.length;
  const progressPct = (unlockedCount / totalCount) * 100;

  const selectedCard = selectedCardId ? allCards.find((c) => c.id === selectedCardId) ?? null : null;
  const selectedIsUnlocked = selectedCardId ? unlockedCards.includes(selectedCardId) : false;

  // Group by type for 'all' tab section headers
  const groups: { type: CardType; cards: Card[] }[] =
    activeTab === 'all'
      ? [
          { type: 'axiom', cards: allCards.filter((c) => c.type === 'axiom') },
          { type: 'postulate', cards: allCards.filter((c) => c.type === 'postulate') },
          { type: 'theorem', cards: allCards.filter((c) => c.type === 'theorem') },
        ]
      : [{ type: activeTab as CardType, cards: filteredCards }];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#2a2a3e] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-[#c9a84c] text-lg">⬡</span>
            <span className="text-white font-bold tracking-tight">유클리드 크래프트</span>
          </Link>
          <Link
            href="/"
            className="text-[#a0a0a0] hover:text-[#c9a84c] text-sm transition-colors flex items-center gap-1.5"
          >
            <span>←</span>
            <span>크래프팅 보드</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#c9a84c]">◈</span>
            <h1 className="text-white text-2xl font-bold">도감</h1>
          </div>
          <p className="text-[#a0a0a0] text-sm ml-6">
            유클리드 원론 1권 — 총 {totalCount}장의 카드를 발견하세요
          </p>
        </div>

        {/* Progress section */}
        <div className="rounded-2xl border border-[#2a2a3e] bg-[#1e1e2e] p-5 mb-8">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[#a0a0a0] text-xs mb-0.5">진행 상황</p>
              <p className="text-white text-2xl font-bold">
                {unlockedCount}
                <span className="text-[#a0a0a0] text-base font-normal"> / {totalCount}</span>
              </p>
            </div>
            <p className="text-[#c9a84c] text-lg font-semibold">{Math.round(progressPct)}%</p>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full rounded-full bg-[#2a2a3e] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] to-[#d4b560] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex gap-6 mt-4 text-xs text-[#a0a0a0]">
            {(['axiom', 'postulate', 'theorem'] as CardType[]).map((type) => {
              const typeCards = allCards.filter((c) => c.type === type);
              const typeUnlocked = typeCards.filter((c) => unlockedCards.includes(c.id)).length;
              const typeLabels: Record<string, string> = { axiom: '공리', postulate: '공준', theorem: '정리' };
              const dotColors: Record<string, string> = { axiom: 'bg-[#c9a84c]', postulate: 'bg-[#7eb8d4]', theorem: 'bg-[#a07ad4]' };
              return (
                <div key={type} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColors[type]}`} />
                  <span>{typeLabels[type]} {typeUnlocked}/{typeCards.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {TABS.map((tab) => {
            const count = tab.value === 'all'
              ? allCards.length
              : allCards.filter((c) => c.type === tab.value).length;
            const unlocked = tab.value === 'all'
              ? unlockedCount
              : allCards.filter((c) => c.type === tab.value && unlockedCards.includes(c.id)).length;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2
                  ${activeTab === tab.value
                    ? 'bg-[#c9a84c] text-[#0a0a0a]'
                    : 'text-[#a0a0a0] hover:text-white border border-[#2a2a3e] hover:border-[#c9a84c]/40'}
                `}
              >
                {tab.label}
                <span className={`text-xs ${activeTab === tab.value ? 'text-[#0a0a0a]/60' : 'text-[#a0a0a0]/60'}`}>
                  {unlocked}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card sections */}
        <div className="flex flex-col gap-10">
          {groups.map(({ type, cards }) => (
            <section key={type}>
              {/* Section header (only in 'all' tab) */}
              {activeTab === 'all' && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      type === 'axiom' ? 'bg-[#c9a84c]' :
                      type === 'postulate' ? 'bg-[#7eb8d4]' :
                      'bg-[#a07ad4]'
                    }`} />
                    <h2 className="text-white text-base font-semibold">
                      {type === 'axiom' ? '공리 (Axioms)' : type === 'postulate' ? '공준 (Postulates)' : '정리 (Theorems)'}
                    </h2>
                    <span className="text-[#a0a0a0] text-xs">
                      {cards.filter((c) => unlockedCards.includes(c.id)).length}/{cards.length}
                    </span>
                  </div>
                  <p className="text-[#a0a0a0] text-xs ml-4">{SECTION_DESC[type]}</p>
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cards.map((card) => (
                  <CollectionCard
                    key={card.id}
                    card={card}
                    isUnlocked={unlockedCards.includes(card.id)}
                    onClick={() => setSelectedCardId(card.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isUnlocked={selectedIsUnlocked}
        onClose={() => setSelectedCardId(null)}
      />
    </div>
  );
}
