import Link from 'next/link';
import Avatar from './Avatar';
import { TransferRecord } from '@/lib/types';

function formatValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  return `€${(value / 1_000).toFixed(0)}K`;
}

interface TransferCardProps {
  transfer: TransferRecord;
}

export default function TransferCard({ transfer }: TransferCardProps) {
  const player = transfer.player;
  if (!player) return null;

  return (
    <Link href={`/players/${player.id}`} className="block group">
      <div className="ft-card relative w-64 rounded-lg overflow-hidden bg-[#181818] border border-[#2e2e2e] cursor-pointer p-4">
        {/* Top half: Player and fee */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={player.imageUrl}
            fallbackSrc={player.currentClub?.clubLogoUrl || transfer.toClub?.clubLogoUrl}
            name={player.name}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#e5e5e5] truncate">{player.name}</p>
            <p className="text-xs font-black text-[#f59e0b] mt-0.5">
              {formatValue(transfer.fee)}
            </p>
          </div>
        </div>

        {/* Bottom half: Transfer path */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#333]">
          <div className="flex-1 min-w-0 text-center">
            <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">From</p>
            <p className="text-xs font-semibold text-[#ccc] truncate">
              {transfer.fromClub?.name ?? 'Unknown'}
            </p>
          </div>
          <div className="px-2 text-[#555]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 text-center">
            <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">To</p>
            <p className="text-xs font-semibold text-white truncate">
              {transfer.toClub?.name ?? 'Unknown'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
