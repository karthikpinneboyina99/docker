'use client';

import { useState, useEffect } from 'react';

export default function Loading() {
  const [isSlowLoad, setIsSlowLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSlowLoad(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-center max-w-md px-6">
        {/* Simple spinner using Tailwind */}
        <div className="w-12 h-12 border-4 border-[#2e2e2e] border-t-[#f59e0b] rounded-full animate-spin"></div>
        <p className="text-[#888] text-sm font-bold uppercase tracking-widest animate-pulse mt-4">
          {isSlowLoad ? "Waking up database..." : "Loading Data..."}
        </p>
        {isSlowLoad && (
          <p className="text-[#555] text-xs font-medium">
            (This may take a moment on first load due to free-tier database cold starts)
          </p>
        )}
      </div>
    </div>
  );
}
