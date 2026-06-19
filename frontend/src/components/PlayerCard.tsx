import Link from 'next/link';
import Avatar from './Avatar';
import { Player } from '@/lib/types';

const POSITION_LABELS: Record<string, string> = {
  forward:    'FWD',
  midfielder: 'MID',
  defender:   'DEF',
  goalkeeper: 'GK',
};

function formatValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(0)}M`;
  return `€${(value / 1_000).toFixed(0)}K`;
}

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const posLabel = POSITION_LABELS[player.position?.toLowerCase()] ?? player.position?.toUpperCase() ?? '—';

  return (
    <Link href={`/players/${player.id}`} className="block group">
      <div className="ft-card relative w-44 rounded-lg overflow-hidden bg-[#181818] border border-[#2e2e2e] cursor-pointer">
        {/* Poster area */}
        <div className="relative h-52 overflow-hidden bg-[#111]">
          {/* Full-bleed avatar as poster */}
          <Avatar
            src={player.imageUrl}
            fallbackSrc={player.currentClub?.clubLogoUrl}
            name={player.name}
            size="xl"
            className="absolute inset-0 w-full h-full rounded-none"
          />

          {/* Position badge top-left */}
          <span className="absolute top-2 left-2 z-10 text-[10px] font-bold tracking-widest text-[#f59e0b] bg-black/60 px-1.5 py-0.5 rounded">
            {posLabel}
          </span>

          {/* Age badge top-right */}
          <span className="absolute top-2 right-2 z-10 text-[10px] font-semibold text-[#888888] bg-black/60 px-1.5 py-0.5 rounded">
            {player.age}y
          </span>

          {/* Hover overlay — quick stats */}
          <div className="absolute inset-0 z-20 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
            <p className="text-xs uppercase tracking-widest text-[#888888]">Market Value</p>
            <p className="text-xl font-black text-[#f59e0b]">{formatValue(player.marketValue)}</p>
            <div className="w-8 h-px bg-[#333]" />
            <p className="text-xs text-center text-[#aaa]">{player.nationality}</p>
            <p className="text-xs text-[#555]">
              Expires {player.contractExpiry ? new Date(player.contractExpiry).getFullYear() : 'N/A'}
            </p>
          </div>

          {/* Bottom gradient for text legibility */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111] to-transparent z-10" />
        </div>

        {/* Card footer */}
        <div className="p-3">
          <p className="text-sm font-bold text-[#e5e5e5] truncate leading-tight">{player.name}</p>
          <p className="text-xs text-[#888888] truncate mt-0.5">{player.currentClub?.name ?? 'Free Agent'}</p>
        </div>
      </div>
    </Link>
  );
}
