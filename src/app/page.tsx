import Link from 'next/link';
import CardGrid from '@/components/craft/CardGrid';
import CraftingSlot from '@/components/craft/CraftingSlot';
import DiscoveryModal from '@/components/craft/DiscoveryModal';
import HintPanel from '@/components/craft/HintPanel';
import ResetButton from '@/components/craft/ResetButton';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Navigation */}
      <header className="shrink-0 border-b border-[#2a2a3e] bg-[#0a0a0a]/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-[#c9a84c] text-lg">⬡</span>
            <span className="text-white font-bold tracking-tight">유클리드 크래프트</span>
            <span className="hidden sm:inline text-[#a0a0a0] text-xs border border-[#2a2a3e] rounded px-1.5 py-0.5 ml-1">
              원론 1권
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-4">
            <Link
              href="/collection"
              className="text-[#a0a0a0] hover:text-[#c9a84c] text-sm transition-colors flex items-center gap-1.5"
            >
              <span>◈</span>
              <span>도감</span>
            </Link>
            <div className="w-px h-4 bg-[#2a2a3e]" />
            <ResetButton />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {/* Mobile: stacked 60/40 | Desktop: side by side */}
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Left: Card Grid — mobile 60%, desktop 2/3 */}
          <div className="flex-[3] lg:flex-[2] min-h-0 overflow-hidden flex flex-col">
            <CardGrid />
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden lg:block w-px bg-[#2a2a3e] shrink-0" />

          {/* Right: Crafting Slot + Hint — mobile 40%, desktop fixed 288px */}
          <div className="flex-[2] lg:flex-none lg:w-72 min-h-0 flex flex-col gap-3">
            <div className="flex-1 min-h-0 overflow-hidden">
              <CraftingSlot />
            </div>
            <div className="shrink-0">
              <HintPanel />
            </div>
          </div>
        </div>
      </main>

      {/* Discovery Modal (portal-like, rendered at root) */}
      <DiscoveryModal />
    </div>
  );
}
