import Link from 'next/link';
import Avatar from './Avatar';
import { TransferRecord } from '@/lib/types';

function formatValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  return `€${(value / 1_000).toFixed(0)}K`;
}

interface Top10CardProps {
  rank: number;
  transfer: TransferRecord;
}

export default function Top10Card({ rank, transfer }: Top10CardProps) {
  const player = transfer.player;
  if (!player) return null;

  return (
    <Link href={`/players/${player.id}`} className="block group flex-shrink-0 relative">
      <div className="flex items-center w-[300px]">
        {/* The huge Netflix-style Number */}
        <div className="relative z-10 w-24 flex-shrink-0 flex items-center justify-end -mr-6">
          <svg
            viewBox="0 0 100 150"
            className="w-full h-[120px] drop-shadow-2xl"
            aria-hidden="true"
          >
            <text
              x="100"
              y="130"
              fontSize="140"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
              textAnchor="end"
              fill="#0a0a0a"
              stroke="#555"
              strokeWidth="3"
              className="group-hover:stroke-[#f59e0b] group-hover:fill-[#1a1a1a] transition-all duration-300"
              paintOrder="stroke fill"
            >
              {rank}
            </text>
          </svg>
        </div>

        {/* The Card */}
        <div className="relative z-0 flex-1 ft-card rounded-lg overflow-hidden bg-[#181818] border border-[#2e2e2e] p-3 group-hover:border-[#f59e0b] transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <Avatar 
              src={player.imageUrl} 
              fallbackSrc={player.currentClub?.clubLogoUrl || transfer.toClub?.clubLogoUrl}
              name={player.name} 
              size="sm" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#e5e5e5] truncate">{player.name}</p>
              <p className="text-xs font-black text-[#f59e0b] mt-0.5">
                {formatValue(transfer.fee)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#333]">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-0.5">From</p>
              <p className="text-[11px] font-semibold text-[#ccc] truncate">
                {transfer.fromClub?.name ?? 'Unknown'}
              </p>
            </div>
            <div className="px-1 text-[#555]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-0.5">To</p>
              <p className="text-[11px] font-semibold text-white truncate">
                {transfer.toClub?.name ?? 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
