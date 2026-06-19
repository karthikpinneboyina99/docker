'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rumor } from '@/lib/types';

interface HeroCarouselProps {
  rumors: Rumor[];
}

export default function HeroCarousel({ rumors }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validRumors = rumors.filter(
    (r) => r.player?.bannerImageUrl || r.player?.currentClub?.bannerImageUrl
  );

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (validRumors.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validRumors.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [validRumors.length]);

  if (!validRumors || validRumors.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] min-h-[500px] mb-12 overflow-hidden group">
      {validRumors.map((rumor, index) => {
        const isActive = index === currentIndex;
        const bgImage = rumor.player?.bannerImageUrl || rumor.player?.currentClub?.bannerImageUrl;

        return (
          <div
            key={rumor.id}
            className={`absolute inset-0 ${
              isActive ? 'z-10' : 'z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Image with slow crossfade */}
            <div className={`absolute inset-0 bg-[#111] transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}>
              {bgImage ? (
                <img
                  src={bgImage}
                  alt={`${rumor.player?.name} background`}
                  className="w-full h-full object-cover object-center"
                />
              ) : null}
              
              {/* Softer gradient overlay so the photo's vibrant colors are visible */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent md:w-3/4" />
            </div>

            {/* Hero Content with fast slide/fade to prevent ghosting */}
            <div className={`absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-500 ease-out ${
              isActive ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}>
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#f59e0b] text-black text-xs font-black uppercase tracking-widest px-3 py-1 rounded-sm">
                    Hot Rumor
                  </span>
                  <span className="text-[#888] text-sm font-semibold tracking-widest uppercase">
                    {rumor.fromClub?.name} → {rumor.toClub?.name}
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-2 tracking-tight">
                  {rumor.player?.name}
                </h1>
                
                <p className="text-2xl md:text-3xl font-bold text-[#f59e0b] mb-4">
                  {Math.round(rumor.transferProbability || 0)}% chance to join
                </p>
                
                <p className="text-lg text-[#ccc] mb-8 max-w-xl line-clamp-3">
                  Talks are accelerating between {rumor.fromClub?.name} and {rumor.toClub?.name} regarding {rumor.player?.name}. 
                  The {rumor.player?.age}-year-old {rumor.player?.nationality} international has a current market value of €{((rumor.player?.marketValue || 0) / 1000000).toFixed(0)}M.
                </p>
                
                <Link
                  href={`/rumors/${rumor.id}`}
                  className="inline-flex items-center justify-center bg-white text-black font-bold uppercase tracking-widest px-8 py-4 rounded hover:bg-[#f59e0b] transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {validRumors.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-8 h-2 bg-[#f59e0b]' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
