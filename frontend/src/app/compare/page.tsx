import { api } from '@/lib/api';
import PlayerSelect from './PlayerSelect';
import Link from 'next/link';
import { Player } from '@/lib/types';

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  }
  return `€${(value / 1000).toFixed(0)}K`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).getFullYear().toString();
}

export default async function ComparePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const idsParam = typeof params?.ids === 'string' ? params.ids : undefined;
  
  let players: Player[] = [];
  let errorMsg = null;
  
  const initialIds = idsParam ? idsParam.split(',') : [];

  if (initialIds.length > 0) {
    const { data, error } = await api.getComparedPlayers(initialIds);
    if (error) {
      errorMsg = error;
    } else if (data) {
      players = data;
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Player Comparison</h1>
      <p className="text-slate-500 mb-12">Select up to 3 players to compare their stats and current market rumors side-by-side.</p>
      
      <PlayerSelect initialIds={initialIds} />

      {errorMsg && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded mb-8 border border-red-200">
          Error loading comparison: {errorMsg}
        </div>
      )}

      {players.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 font-semibold text-slate-500 w-1/4">Metric</th>
                {players.map(p => (
                  <th key={p.id} className="p-6 font-bold text-lg text-slate-900 w-1/4 border-l border-slate-100">
                    <Link href={`/players/${p.id}`} className="hover:text-emerald-600 transition-colors">
                      {p.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Current Club</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100 font-medium">
                    {p.currentClub?.name || 'Free Agent'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Position</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100 capitalize">{p.position}</td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Age</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100">{p.age} years</td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Nationality</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100">{p.nationality}</td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Contract Expiry</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100">{formatDate(p.contractExpiry)}</td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Market Value</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100 font-semibold text-slate-900">{formatCurrency(p.marketValue)}</td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Estimated Wage (Annual)</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100 text-emerald-700 font-medium bg-emerald-50/30">
                    {p.estimatedWage ? formatCurrency(p.estimatedWage) : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-6 font-medium text-slate-500 bg-slate-50/50">Top Active Rumor</td>
                {players.map(p => (
                  <td key={p.id} className="p-6 border-l border-slate-100 align-top">
                    {p.topRumor ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                          <span className="truncate max-w-[80px]" title={p.topRumor.fromClub?.name}>{p.topRumor.fromClub?.name || '?'}</span>
                          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <span className="truncate max-w-[80px]" title={p.topRumor.toClub?.name}>{p.topRumor.toClub?.name || '?'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {p.topRumor.status.replace('_', ' ')}
                          </span>
                          {p.topRumor.transferProbability !== undefined && (
                            <span className="text-xs font-bold text-emerald-600">
                              {Math.round(p.topRumor.transferProbability * 100)}% Prob
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400 italic">No active rumors</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
