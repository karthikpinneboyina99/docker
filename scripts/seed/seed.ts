import fs from 'fs';
import path from 'path';
import { prisma } from '../../backend/src/prisma';

async function main() {
  console.log('Starting seed...');

  // 1. Upsert Clubs
  const clubs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/clubs.json'), 'utf-8'));
  for (const club of clubs) {
    await prisma.club.upsert({
      where: { id: club.id },
      update: {
        name: club.name,
        league: club.league,
        country: club.country,
        clubLogoUrl: club.clubLogoUrl,
        bannerImageUrl: club.bannerImageUrl,
      },
      create: {
        id: club.id,
        name: club.name,
        league: club.league,
        country: club.country,
        clubLogoUrl: club.clubLogoUrl,
        bannerImageUrl: club.bannerImageUrl,
      },
    });
  }
  console.log(`Upserted ${clubs.length} clubs.`);

  // 2. Upsert Players
  const players = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/players.json'), 'utf-8'));
  for (const player of players) {
    await prisma.player.upsert({
      where: { id: player.id },
      update: { ...player, contractExpiry: new Date(player.contractExpiry) },
      create: { ...player, contractExpiry: new Date(player.contractExpiry) },
    });
  }
  console.log(`Upserted ${players.length} players.`);

  // 3. Upsert Sources
  const sources = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/sources.json'), 'utf-8'));
  for (const source of sources) {
    await prisma.source.upsert({
      where: { id: source.id },
      update: source,
      create: source,
    });
  }
  console.log(`Upserted ${sources.length} sources.`);

  // 4. Ingest Real Rumors (Clear old, insert new)
  let realRumors = [];
  const realRumorsPath = path.join(__dirname, 'data/real_rumors.json');
  const templatePath = path.join(__dirname, 'data/real_rumors_template.json');
  
  if (fs.existsSync(realRumorsPath)) {
    realRumors = JSON.parse(fs.readFileSync(realRumorsPath, 'utf-8'));
  } else if (fs.existsSync(templatePath)) {
    realRumors = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  }

  // Clear existing rumors to prevent dupes since we don't have stable IDs in the manual JSON
  await prisma.rumorSource.deleteMany({});
  await prisma.rumor.deleteMany({});

  let rumorsInserted = 0;
  for (const rumor of realRumors) {
    // Skip template placeholder
    if (rumor.playerName.includes('REPLACE_WITH_REAL_DATA')) continue;

    let dbFromClub = await prisma.club.findFirst({ where: { name: rumor.fromClubName } });
    if (!dbFromClub) {
      console.log(`Auto-creating missing club: ${rumor.fromClubName}`);
      dbFromClub = await prisma.club.create({ data: { name: rumor.fromClubName, league: 'Unknown', country: 'Unknown' } });
    }

    let dbToClub = await prisma.club.findFirst({ where: { name: rumor.toClubName } });
    if (!dbToClub) {
      console.log(`Auto-creating missing club: ${rumor.toClubName}`);
      dbToClub = await prisma.club.create({ data: { name: rumor.toClubName, league: 'Unknown', country: 'Unknown' } });
    }

    let dbPlayer = await prisma.player.findFirst({ where: { name: rumor.playerName } });
    if (!dbPlayer) {
      console.log(`Auto-creating missing player: ${rumor.playerName}`);
      dbPlayer = await prisma.player.create({
        data: {
          name: rumor.playerName,
          position: 'Unknown',
          age: 25,
          nationality: 'Unknown',
          currentClubId: dbFromClub.id,
          contractExpiry: new Date('2028-06-30T00:00:00Z'),
          marketValue: 15000000
        }
      });
    }

    const createdRumor = await prisma.rumor.create({
      data: {
        playerId: dbPlayer.id,
        fromClubId: dbFromClub.id,
        toClubId: dbToClub.id,
        status: rumor.status,
        reportedFee: rumor.reportedFee,
        reportedSummary: rumor.reportedSummary,
        createdAt: new Date(rumor.createdAt),
        updatedAt: new Date(rumor.updatedAt),
      }
    });

    for (const report of rumor.reports) {
      let dbSource = await prisma.source.findFirst({ where: { name: report.sourceName } });
      
      // Auto-create source if it doesn't exist
      if (!dbSource) {
        dbSource = await prisma.source.create({
          data: {
            name: report.sourceName,
            outlet: report.sourceOutlet,
            reliabilityWeight: report.reliabilityWeight,
          }
        });
      }

      await prisma.rumorSource.create({
        data: {
          rumorId: createdRumor.id,
          sourceId: dbSource.id,
          reportedAt: new Date(report.reportedAt)
        }
      });
    }
    rumorsInserted++;
  }
  console.log(`Inserted ${rumorsInserted} real rumors.`);

  // 5. Upsert Transfer History
  const transfers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/transfer_history.json'), 'utf-8'));
  for (const transfer of transfers) {
    await prisma.transferRecord.upsert({
      where: { id: transfer.id },
      update: { ...transfer, date: new Date(transfer.date) },
      create: { ...transfer, date: new Date(transfer.date) },
    });
  }
  console.log(`Upserted ${transfers.length} transfer records.`);

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
