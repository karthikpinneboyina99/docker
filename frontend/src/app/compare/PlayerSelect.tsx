'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Player } from '@/lib/types';

export default function PlayerSelect({ initialIds = [] }: { initialIds?: string[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  // Simple debounce and fetch
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/players?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.data) {
        setResults(data.data.slice(0, 5));
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch initial selected players if they exist in URL but not in state (useful for hard refreshes)
  useEffect(() => {
    if (initialIds.length > 0 && selectedPlayers.length === 0) {
      const fetchInitial = async () => {
        const res = await fetch(`/api/players/compare?ids=${initialIds.join(',')}`);
        const data = await res.json();
        if (data.data) {
          setSelectedPlayers(data.data);
        }
      };
      fetchInitial();
    }
  }, [initialIds, selectedPlayers.length]);

  const handleSelect = (player: Player) => {
    if (selectedPlayers.length >= 3) return;
    if (selectedPlayers.find(p => p.id === player.id)) return;
    setSelectedPlayers([...selectedPlayers, player]);
    setQuery('');
    setResults([]);
  };

  const handleRemove = (id: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== id));
  };

  const handleCompare = () => {
    if (selectedPlayers.length === 0) {
      router.push('/compare');
      return;
    }
    const ids = selectedPlayers.map(p => p.id).join(',');
    router.push(`/compare?ids=${ids}`);
  };

  return (
    <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm mb-12 max-w-3xl">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Select Players (Max 3)</h2>
      
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
        {selectedPlayers.map(p => (
          <div key={p.id} className="flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200">
            {p.name}
            <button onClick={() => handleRemove(p.id)} className="text-slate-400 hover:text-red-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {selectedPlayers.length === 0 && (
          <div className="text-sm text-slate-400 py-1.5 italic">No players selected...</div>
        )}
      </div>

      <div className="relative flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search player name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={selectedPlayers.length >= 3}
            className="w-full border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:bg-slate-50 disabled:text-slate-400"
          />
          {results.length > 0 && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded shadow-md z-10">
              {results.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-100 last:border-0"
                >
                  <span className="font-medium">{p.name}</span> <span className="text-slate-400 text-xs ml-2">{p.currentClub?.name || 'No Club'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={handleCompare}
          disabled={selectedPlayers.length < 2}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Compare
        </button>
      </div>
    </div>
  );
}
