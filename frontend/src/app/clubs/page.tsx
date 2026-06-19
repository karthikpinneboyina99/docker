import { api } from '@/lib/api';
import Link from 'next/link';

export const revalidate = 60; // Cache for 60 seconds

export default async function ClubsPage() {
  const res = await api.getClubs();
  const clubs = res.data || [];

  return (
    <div className="max-w-[1600px] mx-auto py-12 px-6 md:px-0">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-[#e5e5e5] tracking-tight uppercase mb-2">
          Clubs
        </h1>
        <p className="text-[#888] font-medium tracking-wide">
          Browse all clubs and their transfer activity.
        </p>
      </div>

      {!clubs.length && (
        <div className="flex items-center justify-center h-64 border border-[#2e2e2e] border-dashed rounded-xl">
          <p className="text-[#555] font-semibold uppercase tracking-widest text-sm">No clubs found.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {clubs.map((club) => (
          <Link 
            key={club.id} 
            href={`/clubs/${club.id}`}
            className="group block bg-[#181818] border border-[#2e2e2e] rounded-xl p-6 hover:border-[#f59e0b] transition-colors flex flex-col items-center text-center"
          >
            {club.clubLogoUrl ? (
              <div className="w-24 h-24 mb-4 p-2 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <img 
                  src={club.clubLogoUrl} 
                  alt={club.name} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 mb-4 bg-[#111] border border-[#2e2e2e] rounded-2xl flex items-center justify-center group-hover:border-[#f59e0b] transition-colors">
                <span className="text-3xl font-black text-[#555]">{club.name.charAt(0)}</span>
              </div>
            )}
            
            <h3 className="text-lg font-bold text-[#e5e5e5] group-hover:text-[#f59e0b] transition-colors line-clamp-1">
              {club.name}
            </h3>
            <p className="text-[#888] text-xs font-bold uppercase tracking-widest mt-1">
              {club.league}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
