'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/rumors', label: 'Rumors' },
  { href: '/players', label: 'Players' },
  { href: '/compare', label: 'Compare' },
  { href: '/clubs', label: 'Clubs' },
  { href: '/contracts', label: 'Contracts' },
];

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      header.setAttribute('data-scrolled', window.scrollY > 20 ? 'true' : 'false');
    };

    // Set initial state
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      id="ft-header"
      ref={headerRef}
      data-scrolled="false"
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[#f59e0b] text-2xl font-black tracking-tight group-hover:text-amber-400 transition-colors">
            FootTalks
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  active
                    ? 'text-white'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Search icon placeholder */}
        <button
          aria-label="Search"
          className="text-[#888888] hover:text-white transition-colors p-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </button>
      </nav>
    </header>
  );
}
