'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm:  { outer: 'w-8 h-8',   text: 'text-xs' },
  md:  { outer: 'w-12 h-12', text: 'text-sm' },
  lg:  { outer: 'w-20 h-20', text: 'text-lg' },
  xl:  { outer: 'w-full h-full', text: 'text-3xl' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');
}

// Deterministic background color from name
function getColor(name: string): string {
  const colors = [
    '#1e3a5f', // dark navy
    '#1a3a2a', // dark green
    '#3a1a2a', // dark plum
    '#2a1a3a', // dark purple
    '#3a2a1a', // dark amber
    '#1a2a3a', // dark teal
    '#3a1a1a', // dark red
    '#1a1a3a', // dark indigo
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ 
  src, 
  fallbackSrc, 
  name, 
  size = 'md', 
  className = '' 
}: AvatarProps & { fallbackSrc?: string | null }) {
  const [loadState, setLoadState] = useState<'MAIN' | 'FALLBACK' | 'INITIALS'>(
    src ? 'MAIN' : (fallbackSrc ? 'FALLBACK' : 'INITIALS')
  );

  const { outer, text } = SIZE_MAP[size];
  const initials = getInitials(name);
  const bgColor = getColor(name);

  const handleMainError = () => {
    if (fallbackSrc) {
      setLoadState('FALLBACK');
    } else {
      setLoadState('INITIALS');
    }
  };

  const handleFallbackError = () => {
    setLoadState('INITIALS');
  };

  return (
    <div
      className={`${outer} ${className} relative rounded-full overflow-hidden flex-shrink-0 bg-[#181818] border border-[#2e2e2e]`}
      style={loadState === 'INITIALS' ? { backgroundColor: bgColor } : undefined}
    >
      {loadState === 'MAIN' && src && (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={handleMainError}
          loading="lazy"
        />
      )}

      {loadState === 'FALLBACK' && fallbackSrc && (
        <div className="w-full h-full bg-[#111] flex items-center justify-center p-1.5">
          <img
            src={fallbackSrc}
            alt={`${name} club fallback`}
            className="w-full h-full object-contain mix-blend-luminosity opacity-80"
            onError={handleFallbackError}
            loading="lazy"
          />
        </div>
      )}

      {loadState === 'INITIALS' && (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`${text} font-bold text-white/80 select-none`}>{initials}</span>
        </div>
      )}
    </div>
  );
}
