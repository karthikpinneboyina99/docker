import { api } from '@/lib/api';
import PlayerCard from '@/components/PlayerCard';

export const revalidate = 60; // Cache for 60 seconds to make rendering faster

export default async function PlayersPage() {
  const res = await api.getPlayers();
  const players = res.data || [];

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-6 md:px-0">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-[#e5e5e5] tracking-tight uppercase mb-2">
          Players
        </h1>
        <p className="text-[#888] font-medium tracking-wide">
          Browse all tracked players.
        </p>
      </div>

      {!players.length && (
        <div className="flex items-center justify-center h-64 border border-[#2e2e2e] border-dashed rounded-xl">
          <p className="text-[#555] font-semibold uppercase tracking-widest text-sm">No players found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
