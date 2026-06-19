import { api } from '@/lib/api';
import Link from 'next/link';
import RumorCard from '@/components/RumorCard';

const STATUS_FILTERS = [
  { id: '', label: 'All' },
  { id: 'RUMOR', label: 'Rumors' },
  { id: 'ADVANCED_TALKS', label: 'Advanced Talks' },
  { id: 'AGREED', label: 'Agreed' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'DENIED', label: 'Denied' },
  { id: 'DEAD', label: 'Dead' },
];

export default async function RumorsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const status = typeof params?.status === 'string' ? params.status : '';
  
  const { data: rumors, error } = await api.getRumors({ status: status || undefined });

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-6 md:px-0">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-[#e5e5e5] tracking-tight uppercase mb-6">
          Transfer Market
        </h1>
        
        {/* Horizontal Pill/Chip Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map(filter => {
            const isActive = status === filter.id;
            return (
              <Link 
                key={filter.id}
                href={filter.id ? `/rumors?status=${filter.id}` : '/rumors'}
                className={`
                  px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-colors
                  ${isActive 
                    ? 'bg-[#f59e0b] text-black' 
                    : 'bg-[#181818] text-[#888888] hover:bg-[#222] hover:text-[#e5e5e5] border border-[#2e2e2e]'
                  }
                `}
              >
                {filter.label}
              </Link>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded mb-8 text-sm">
          Error loading rumors: {error}
        </div>
      )}

      {!rumors?.length && !error && (
        <div className="flex items-center justify-center h-64 border border-[#2e2e2e] border-dashed rounded-xl">
          <p className="text-[#555] font-semibold uppercase tracking-widest text-sm">No rumors found.</p>
        </div>
      )}

      {/* Grid of RumorCards */}
      <div className="flex flex-wrap gap-6">
        {rumors?.map((rumor) => (
          <RumorCard key={rumor.id} rumor={rumor} />
        ))}
      </div>
    </div>
  );
}
