'use client';

import { useRef } from 'react';

interface HorizontalScrollRowProps {
  title: string;
  children: React.ReactNode;
}

export default function HorizontalScrollRow({ title, children }: HorizontalScrollRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: direction === 'right' ? 320 : -320,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mb-10">
      {/* Row title */}
      <div className="flex items-center justify-between mb-4 px-6 md:px-0">
        <h2 className="text-base font-bold text-[#e5e5e5] tracking-tight uppercase">
          {title}
        </h2>
        {/* Scroll buttons — visible on desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full bg-[#222] hover:bg-[#333] text-[#888] hover:text-white transition-colors flex items-center justify-center"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full bg-[#222] hover:bg-[#333] text-[#888] hover:text-white transition-colors flex items-center justify-center"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable row with fade edges */}
      <div className="relative ft-fade-left ft-fade-right">
        <div
          ref={rowRef}
          className="ft-scroll-row px-6 md:px-0"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
