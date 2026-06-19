import Link from 'next/link';
import Avatar from './Avatar';
import { Rumor } from '@/lib/types';

type RumorStatus = 'RUMOR' | 'ADVANCED_TALKS' | 'AGREED' | 'COMPLETED' | 'DENIED' | 'DEAD';

const STATUS_CONFIG: Record<RumorStatus, { label: string; color: string; bg: string }> = {
  RUMOR:          { label: 'Rumor',          color: '#818cf8', bg: 'rgba(99,102,241,0.12)'  },
  ADVANCED_TALKS: { label: 'Advanced Talks', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  AGREED:         { label: 'Agreed',         color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  COMPLETED:      { label: 'Completed',      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  DENIED:         { label: 'Denied',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
  DEAD:           { label: 'Dead',           color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};

function formatValue(value?: number | null): string {
  if (!value) return 'Undisclosed';
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(0)}M`;
  return `€${(value / 1_000).toFixed(0)}K`;
}

interface RumorCardProps {
  rumor: Rumor;
}

export default function RumorCard({ rumor }: RumorCardProps) {
  const status = rumor.status as RumorStatus;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.RUMOR;
  const probability = rumor.transferProbability !== undefined
    ? Math.round(rumor.transferProbability)
    : null;

  return (
    <Link href={`/rumors/${rumor.id}`} className="block group">
      <div className="ft-card relative w-72 rounded-xl overflow-hidden bg-[#181818] border border-[#2e2e2e] cursor-pointer">
        {/* Top accent strip — keyed by status */}
        <div className="h-1 w-full" style={{ backgroundColor: cfg.color }} />

        <div className="p-4">
          {/* Status badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{ color: cfg.color, backgroundColor: cfg.bg }}
            >
              {cfg.label}
            </span>
            {probability !== null && (
              <span className="text-xs font-black text-[#f59e0b]">
                {probability}%
              </span>
            )}
          </div>

          {/* Player name */}
          <p className="text-base font-black text-[#e5e5e5] leading-tight truncate mb-3">
            {rumor.player?.name ?? 'Unknown Player'}
          </p>

          <Avatar
            src={rumor.player?.imageUrl}
            fallbackSrc={rumor.player?.currentClub?.clubLogoUrl || rumor.fromClub?.clubLogoUrl}
            name={rumor.player?.name ?? 'Unknown Player'}
            size="md"
            className="ring-2 ring-[#2e2e2e] relative z-10"
          />

          {/* Transfer arrow */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-widest text-[#555] mb-0.5">From</p>
              <p className="text-xs font-semibold text-[#aaa] truncate">{rumor.fromClub?.name ?? '—'}</p>
            </div>
            <svg className="w-4 h-4 text-[#f59e0b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#555] mb-0.5">To</p>
              <p className="text-xs font-semibold text-white truncate">{rumor.toClub?.name ?? '—'}</p>
            </div>
          </div>

          {/* Footer: fee + reliability bar */}
          <div className="border-t border-[#2e2e2e] pt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#555]">Fee</p>
              <p className="text-xs font-bold text-[#e5e5e5]">{formatValue(rumor.reportedFee)}</p>
            </div>
            {rumor.reliabilityScore !== undefined && (
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-[#555] mb-1 text-right">Reliability</p>
                <div className="h-1 bg-[#2e2e2e] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${rumor.reliabilityScore}%`,
                      backgroundColor: rumor.reliabilityScore > 70 ? '#10b981' : rumor.reliabilityScore > 40 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hover: amber glow border */}
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent group-hover:ring-[#f59e0b]/30 transition-all duration-200 pointer-events-none" />
      </div>
    </Link>
  );
}
