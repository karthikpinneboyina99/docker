import { api } from '@/lib/api';
import HorizontalScrollRow from '@/components/HorizontalScrollRow';
import PlayerCard from '@/components/PlayerCard';
import RumorCard from '@/components/RumorCard';

export const revalidate = 60;

function formatValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  return `€${(value / 1_000).toFixed(0)}K`;
}

export default async function PlayerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [playerRes, similarRes, wageRes] = await Promise.all([
    api.getPlayer(id),
    api.getSimilarPlayers(id),
    api.getPlayerWageEstimate(id)
  ]);

  const player = playerRes.data;
  const similarPlayers = similarRes.data || [];
  const wage = wageRes.data;

  if (!player) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-[#555] font-semibold uppercase tracking-widest">Player not found</p>
      </div>
    );
  }

  // Active rumor block logic
  const activeRumor = player.topRumor;
  const rumorSummary = activeRumor?.reportedSummary || null;

  return (
    <div className="pb-20">
      {/* Large Header Banner */}
      <div className="relative w-full h-[50vh] min-h-[400px] mb-12">
        <div className="absolute inset-0 bg-[#111]">
          {player.imageUrl ? (
            <img
              src={player.imageUrl}
              alt={player.name}
              className="w-full h-full object-cover object-top opacity-50 mix-blend-luminosity"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#181818] to-[#0a0a0a]" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
              <div>
                <p className="text-[#f59e0b] font-bold tracking-widest uppercase mb-2">
                  {player.position} • {player.currentClub?.name || 'Free Agent'}
                </p>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
                  {player.name}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Stats & Info */}
        <div className="lg:col-span-2 space-y-12">
          {/* Key Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-xl p-6 flex flex-col justify-center">
              <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mb-1">Age</p>
              <p className="text-3xl font-black text-[#e5e5e5]">{player.age}</p>
            </div>
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-xl p-6 flex flex-col justify-center">
              <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mb-1">Nationality</p>
              <p className="text-xl font-bold text-[#e5e5e5] truncate">{player.nationality}</p>
            </div>
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-xl p-6 flex flex-col justify-center">
              <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mb-1">Market Value</p>
              <p className="text-2xl font-black text-[#10b981]">{formatValue(player.marketValue)}</p>
            </div>
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-xl p-6 flex flex-col justify-center">
              <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mb-1">Contract Expires</p>
              <p className="text-xl font-bold text-[#e5e5e5]">
                {player.contractExpiry ? new Date(player.contractExpiry).getFullYear() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Data Wage Estimate Callout */}
          {wage && (
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#222] text-[#888] px-2 py-1 rounded">Data Insight</span>
              </div>
              <h3 className="text-sm font-bold text-[#888888] uppercase tracking-widest mb-4">Estimated Wage</h3>
              <p className="text-4xl font-black text-[#f59e0b] mb-4">{formatValue(wage.estimatedWage)} / yr</p>
              <p className="text-[#ccc] text-sm leading-relaxed max-w-2xl">{wage.explanation}</p>
            </div>
          )}
        </div>

        {/* Right Column: Active Rumor */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-base font-bold text-[#e5e5e5] uppercase tracking-tight mb-4">Active Transfer Rumor</h2>
          {activeRumor ? (
            <div className="space-y-6">
              <RumorCard rumor={activeRumor} />
              
              {/* Data Summary Callout */}
              {rumorSummary && (
                <div className="bg-[#181818] border border-[#f59e0b]/30 rounded-xl p-6 relative">
                  <div className="absolute -top-3 left-6 bg-[#f59e0b] text-black text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                    Report Summary
                  </div>
                  <p className="text-sm text-[#ccc] leading-relaxed mt-2 italic">
                    "{rumorSummary}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#181818] border border-[#2e2e2e] rounded-xl p-8 text-center">
              <p className="text-[#555] font-semibold uppercase tracking-widest text-sm mb-2">No Active Rumors</p>
              <p className="text-[#888] text-xs">Player is expected to stay at {player.currentClub?.name}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Similar Players Row */}
      {similarPlayers.length > 0 && (
        <div className="max-w-[1600px] mx-auto mt-16">
          <HorizontalScrollRow title="Similar Players">
            {similarPlayers.map(p => (
              <PlayerCard key={p.id} player={p} />
            ))}
          </HorizontalScrollRow>
        </div>
      )}
    </div>
  );
}
