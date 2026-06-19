/**
 * /preview — Component showcase page.
 * Shows PlayerCard, RumorCard, and HorizontalScrollRow in isolation
 * using real data from the API. Not linked in main nav — visit manually.
 */

import { api } from '@/lib/api';
import PlayerCard from '@/components/PlayerCard';
import RumorCard from '@/components/RumorCard';
import HorizontalScrollRow from '@/components/HorizontalScrollRow';

export default async function PreviewPage() {
  const [playersRes, rumorsRes] = await Promise.all([
    api.getPlayers(),
    api.getRumors(),
  ]);

  const players = playersRes.data ?? [];
  const rumors = rumorsRes.data ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12">
      <div className="max-w-7xl mx-auto px-6">

        {/* Page title */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-widest text-[#f59e0b] mb-2">Design System</p>
          <h1 className="text-4xl font-black text-white tracking-tight">Component Preview</h1>
          <p className="text-[#888] mt-2">All components shown in isolation using live data.</p>
        </div>

        {/* ========================
            STATUS BADGE REFERENCE
            ======================== */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#555] mb-4">Status Badges</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Rumor',          color: '#818cf8', bg: 'rgba(99,102,241,0.12)'  },
              { label: 'Advanced Talks', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
              { label: 'Agreed',         color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
              { label: 'Completed',      color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
              { label: 'Denied',         color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
              { label: 'Dead',           color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
            ].map(s => (
              <span
                key={s.label}
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ color: s.color, backgroundColor: s.bg }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </section>

        {/* ========================
            PLAYER CARDS
            ======================== */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#555] mb-4">PlayerCard — Hover to reveal stats</h2>
          <HorizontalScrollRow title="Featured Players">
            {players.slice(0, 12).map(player => (
              <div key={player.id} className="ft-scroll-item">
                <PlayerCard player={player} />
              </div>
            ))}
          </HorizontalScrollRow>
        </section>

        {/* ========================
            RUMOR CARDS
            ======================== */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#555] mb-4">RumorCard — Hover for amber glow</h2>
          <HorizontalScrollRow title="Latest Rumors">
            {rumors.slice(0, 10).map(rumor => (
              <div key={rumor.id} className="ft-scroll-item">
                <RumorCard rumor={rumor} />
              </div>
            ))}
          </HorizontalScrollRow>
        </section>

        {/* ========================
            TYPOGRAPHY SCALE
            ======================== */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#555] mb-6">Typography Scale</h2>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest text-[#f59e0b]">Label / Metadata — 10px uppercase tracked</p>
            <p className="text-xs text-[#888]">Secondary text — 12px gray</p>
            <p className="text-sm text-[#e5e5e5]">Body text — 14px off-white</p>
            <p className="text-base font-bold text-white">Card heading — 16px bold white</p>
            <p className="text-2xl font-black text-white tracking-tight">Section heading — 24px black</p>
            <p className="text-4xl font-black text-white tracking-tight">Page heading — 36px black</p>
            <p className="text-6xl font-black text-[#f59e0b] tracking-tight">Hero stat — 60px amber</p>
          </div>
        </section>

        {/* ========================
            COLOR PALETTE
            ======================== */}
        <section className="mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#555] mb-4">Color Palette</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'bg',        color: '#0a0a0a', label: 'Background' },
              { name: 'surface',   color: '#181818', label: 'Surface' },
              { name: 'alt',       color: '#222222', label: 'Surface Alt' },
              { name: 'border',    color: '#2e2e2e', label: 'Border' },
              { name: 'amber',     color: '#f59e0b', label: 'Amber (accent)' },
              { name: 'text',      color: '#e5e5e5', label: 'Text' },
              { name: 'muted',     color: '#888888', label: 'Muted' },
              { name: 'faint',     color: '#555555', label: 'Faint' },
            ].map(c => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div
                  className="w-14 h-14 rounded-lg border border-[#333]"
                  style={{ backgroundColor: c.color }}
                />
                <p className="text-[10px] text-[#555] text-center">{c.label}</p>
                <p className="text-[9px] text-[#444] font-mono">{c.color}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
