import { api } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60;

function formatValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
  return `€${(value / 1_000).toFixed(0)}K`;
}

function getUrgencyStyle(expiryDate: Date | string | null) {
  if (!expiryDate) return 'border-l-transparent';
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const monthsDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  if (monthsDiff <= 6) {
    return 'border-l-4 border-l-red-500 bg-red-950/10 hover:bg-red-950/20'; // Critical/Expired
  } else if (monthsDiff <= 12) {
    return 'border-l-4 border-l-[#f59e0b] bg-[#f59e0b]/5 hover:bg-[#f59e0b]/10'; // High urgency
  } else if (monthsDiff <= 24) {
    return 'border-l-4 border-l-emerald-500 bg-emerald-950/10 hover:bg-emerald-950/20'; // Medium
  }
  
  return 'border-l-4 border-l-[#2e2e2e] bg-[#111] hover:bg-[#181818]'; // Low urgency
}

function getUrgencyBadge(expiryDate: Date | string | null) {
  if (!expiryDate) return null;
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const monthsDiff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44);

  if (monthsDiff <= 0) {
    return <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">Expired</span>;
  } else if (monthsDiff <= 6) {
    return <span className="bg-red-500/20 text-red-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded">&lt; 6 mos</span>;
  } else if (monthsDiff <= 12) {
    return <span className="bg-[#f59e0b]/20 text-[#f59e0b] text-[10px] font-bold uppercase px-2 py-0.5 rounded">&lt; 1 yr</span>;
  }
  return null;
}

export default async function ContractsPage() {
  // Fetch up to 24 months for a good spread
  const res = await api.getExpiringContracts(24);
  const players = res.data || [];

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-6 md:px-0">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-[#e5e5e5] tracking-tight uppercase mb-2">
          Expiring Contracts
        </h1>
        <p className="text-[#888] font-medium tracking-wide">
          Players entering the final stages of their deals.
        </p>
      </div>

      <div className="bg-[#111] border border-[#2e2e2e] rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#2e2e2e]">
                <th className="p-4 text-xs font-bold text-[#555] uppercase tracking-widest w-1/4">Player</th>
                <th className="p-4 text-xs font-bold text-[#555] uppercase tracking-widest w-1/4">Club</th>
                <th className="p-4 text-xs font-bold text-[#555] uppercase tracking-widest">Pos</th>
                <th className="p-4 text-xs font-bold text-[#555] uppercase tracking-widest">Age</th>
                <th className="p-4 text-xs font-bold text-[#555] uppercase tracking-widest text-right">Value</th>
                <th className="p-4 text-xs font-bold text-[#555] uppercase tracking-widest text-right">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e2e2e]">
              {players.map((player) => (
                <tr 
                  key={player.id} 
                  className={`transition-colors group ${getUrgencyStyle(player.contractExpiry)}`}
                >
                  <td className="p-4">
                    <Link 
                      href={`/players/${player.id}`}
                      className="font-bold text-[#e5e5e5] group-hover:text-[#f59e0b] transition-colors flex items-center gap-3"
                    >
                      {player.imageUrl ? (
                        <img 
                          src={player.imageUrl} 
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#2e2e2e]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#2e2e2e] flex items-center justify-center">
                          <span className="text-xs font-bold text-[#888]">{player.name.charAt(0)}</span>
                        </div>
                      )}
                      <span>{player.name}</span>
                    </Link>
                  </td>
                  <td className="p-4">
                    {player.currentClub ? (
                      <Link 
                        href={`/clubs/${player.currentClubId}`}
                        className="text-[#ccc] hover:text-white transition-colors"
                      >
                        {player.currentClub.name}
                      </Link>
                    ) : (
                      <span className="text-[#888] italic">Free Agent</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-[#888] text-sm font-medium">{player.position}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-[#ccc]">{player.age}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-[#10b981]">{formatValue(player.marketValue)}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getUrgencyBadge(player.contractExpiry)}
                      <span className="text-[#e5e5e5] font-medium">
                        {player.contractExpiry 
                          ? new Date(player.contractExpiry).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) 
                          : 'Unknown'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              
              {players.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#555] font-semibold uppercase tracking-widest text-sm">
                    No expiring contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
