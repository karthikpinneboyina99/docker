import Link from 'next/link';
import { api } from '@/lib/api';
import HorizontalScrollRow from '@/components/HorizontalScrollRow';
import RumorCard from '@/components/RumorCard';
import PlayerCard from '@/components/PlayerCard';
import TransferCard from '@/components/TransferCard';
import Top10Card from '@/components/Top10Card';
import HeroCarousel from '@/components/HeroCarousel';

export const revalidate = 60; // Disable static caching for MVP

export default async function Home() {
  // Fetch data in parallel
  const [
    rumorsRes,
    contractsRes,
    transfersRes,
    playersRes
  ] = await Promise.all([
    api.getRumors(),
    api.getExpiringContracts(12),
    api.getTransfers(),
    api.getPlayers() // to group by league
  ]);

  const allRumors = rumorsRes.data || [];
  const expiringPlayers = contractsRes.data || [];
  const recentTransfers = transfersRes.data || [];
  const allPlayers = playersRes.data || [];

  // Hero Rumors: Top 5 hot rumors (sorted by probability)
  const heroRumors = [...allRumors]
    .sort((a, b) => (b.transferProbability || 0) - (a.transferProbability || 0))
    .slice(0, 5);

  const heroIds = new Set(heroRumors.map(r => r.id));

  // Trending Rumors: highest reliability, exclude hero rumors
  const trendingRumors = [...allRumors]
    .filter(r => !heroIds.has(r.id))
    .sort((a, b) => (b.reliabilityScore || 0) - (a.reliabilityScore || 0))
    .slice(0, 10);

  // Top 10 Biggest Transfers
  const top10Transfers = [...recentTransfers]
    .sort((a, b) => (b.fee || 0) - (a.fee || 0))
    .slice(0, 10);

  // Group players by league for the "By League" rows
  const playersByLeague = allPlayers.reduce((acc, player) => {
    const league = player.currentClub?.league || 'Other';
    if (!acc[league]) acc[league] = [];
    acc[league].push(player);
    return acc;
  }, {} as Record<string, typeof allPlayers>);

  // Only take top 2 leagues with the most players for UI simplicity
  const topLeagues = Object.entries(playersByLeague)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 2);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <HeroCarousel rumors={heroRumors} />

      {/* Main Content Rows */}
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Top 10 Transfers (Netflix style) */}
        {top10Transfers.length > 0 && (
          <HorizontalScrollRow title="Top 10 Biggest Transfers">
            {top10Transfers.map((transfer, index) => (
              <Top10Card key={transfer.id} rank={index + 1} transfer={transfer} />
            ))}
          </HorizontalScrollRow>
        )}

        {/* Trending Rumors */}
        {trendingRumors.length > 0 && (
          <HorizontalScrollRow title="Trending Rumors">
            {trendingRumors.map(rumor => (
              <RumorCard key={rumor.id} rumor={rumor} />
            ))}
          </HorizontalScrollRow>
        )}

        {/* Expiring Contracts */}
        {expiringPlayers.length > 0 && (
          <HorizontalScrollRow title="Expiring Contracts (< 12 months)">
            {expiringPlayers.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </HorizontalScrollRow>
        )}

        {/* Recent Transfers */}
        {recentTransfers.length > 0 && (
          <HorizontalScrollRow title="Recent Transfers">
            {recentTransfers.map(transfer => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </HorizontalScrollRow>
        )}

        {/* By League */}
        {topLeagues.map(([league, players]) => (
          <HorizontalScrollRow key={league} title={`Top Players: ${league}`}>
            {players.map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </HorizontalScrollRow>
        ))}
      </div>
    </div>
  );
}
