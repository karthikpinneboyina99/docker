import { api } from '@/lib/api';
import HorizontalScrollRow from '@/components/HorizontalScrollRow';
import PlayerCard from '@/components/PlayerCard';
import ClubSpendingChart from '@/components/ClubSpendingChart';

export const revalidate = 60;

export default async function ClubDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // We don't have a direct getClub(id) endpoint, so fetch all and filter.
  // Also fetch the squad (players by club id) and spending data.
  const [clubsRes, playersRes, spendingRes] = await Promise.all([
    api.getClubs(),
    api.getPlayers({ club: id }),
    api.getClubSpending(id)
  ]);

  const club = clubsRes.data?.find(c => c.id === id);
  const squad = playersRes.data || [];
  const spending = spendingRes.data || [];

  if (!club) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-[#555] font-semibold uppercase tracking-widest">Club not found</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Club Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] mb-12 flex items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[#0a0a0a]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#181818] to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-[#f59e0b]/5 mix-blend-overlay" />
          
          {/* Subtle grid pattern for texture */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(#2e2e2e 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            opacity: 0.3
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center p-6 mt-8">
          {club.clubLogoUrl ? (
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 p-4 rounded-3xl backdrop-blur-md border border-white/10 mb-6 shadow-2xl flex items-center justify-center">
              <img
                src={club.clubLogoUrl}
                alt={club.name}
                className="max-w-full max-h-full object-contain drop-shadow-xl"
              />
            </div>
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#181818] to-[#0a0a0a] rounded-3xl border border-[#2e2e2e] mb-6 flex items-center justify-center">
              <span className="text-4xl font-black text-[#888]">{club.name.charAt(0)}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{club.name}</h1>
          <p className="text-[#f59e0b] font-bold tracking-widest uppercase mt-2">{club.league}</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-0">
        {/* Spending Chart Section */}
        <div className="mb-16 bg-[#111] border border-[#2e2e2e] rounded-2xl p-6 md:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#e5e5e5] uppercase tracking-tight">Transfer Spending</h2>
            <p className="text-[#888] text-sm mt-1">Total transfer expenditure by window (mock data)</p>
          </div>
          
          {spending.length > 0 ? (
            <ClubSpendingChart data={spending} />
          ) : (
            <div className="h-[300px] flex items-center justify-center border border-[#2e2e2e] border-dashed rounded-xl">
              <p className="text-[#555] font-semibold uppercase tracking-widest text-sm">No spending data available.</p>
            </div>
          )}
        </div>

        {/* Squad List */}
        {squad.length > 0 && (
          <div className="mb-12">
            <HorizontalScrollRow title="Current Squad">
              {squad.map(player => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </HorizontalScrollRow>
          </div>
        )}
      </div>
    </div>
  );
}
