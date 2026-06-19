const fs = require('fs');
const crypto = require('crypto');

function uuid() { return crypto.randomUUID(); }

const clubsData = [
  { name: "Real Madrid", league: "La Liga", country: "Spain" },
  { name: "FC Barcelona", league: "La Liga", country: "Spain" },
  { name: "Atletico Madrid", league: "La Liga", country: "Spain" },
  { name: "Manchester City", league: "Premier League", country: "England" },
  { name: "Arsenal", league: "Premier League", country: "England" },
  { name: "Liverpool", league: "Premier League", country: "England" },
  { name: "Manchester United", league: "Premier League", country: "England" },
  { name: "Chelsea", league: "Premier League", country: "England" },
  { name: "Tottenham Hotspur", league: "Premier League", country: "England" },
  { name: "Aston Villa", league: "Premier League", country: "England" },
  { name: "Newcastle United", league: "Premier League", country: "England" },
  { name: "Bayern Munich", league: "Bundesliga", country: "Germany" },
  { name: "Borussia Dortmund", league: "Bundesliga", country: "Germany" },
  { name: "Bayer Leverkusen", league: "Bundesliga", country: "Germany" },
  { name: "RB Leipzig", league: "Bundesliga", country: "Germany" },
  { name: "Paris Saint-Germain", league: "Ligue 1", country: "France" },
  { name: "AS Monaco", league: "Ligue 1", country: "France" },
  { name: "Juventus", league: "Serie A", country: "Italy" },
  { name: "Inter Milan", league: "Serie A", country: "Italy" },
  { name: "AC Milan", league: "Serie A", country: "Italy" }
];

const clubs = clubsData.map(c => ({ id: uuid(), ...c }));
const clubMap = {};
clubs.forEach(c => clubMap[c.name] = c.id);

fs.writeFileSync('scripts/seed/data/clubs.json', JSON.stringify(clubs, null, 2));

const playersData = [
  { name: "Kylian Mbappé", position: "Forward", age: 25, nationality: "France", club: "Real Madrid", contractExpiry: "2029-06-30T00:00:00Z", marketValue: 180000000, estimatedWage: 31000000 },
  { name: "Jude Bellingham", position: "Midfielder", age: 21, nationality: "England", club: "Real Madrid", contractExpiry: "2029-06-30T00:00:00Z", marketValue: 180000000, estimatedWage: 20000000 },
  { name: "Vinícius Júnior", position: "Forward", age: 24, nationality: "Brazil", club: "Real Madrid", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 150000000, estimatedWage: 20000000 },
  { name: "Erling Haaland", position: "Forward", age: 24, nationality: "Norway", club: "Manchester City", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 180000000, estimatedWage: 22000000 },
  { name: "Phil Foden", position: "Midfielder", age: 24, nationality: "England", club: "Manchester City", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 150000000, estimatedWage: 11000000 },
  { name: "Rodri", position: "Midfielder", age: 28, nationality: "Spain", club: "Manchester City", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 130000000, estimatedWage: 11000000 },
  { name: "Bukayo Saka", position: "Forward", age: 22, nationality: "England", club: "Arsenal", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 140000000, estimatedWage: 10000000 },
  { name: "Martin Ødegaard", position: "Midfielder", age: 25, nationality: "Norway", club: "Arsenal", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 110000000, estimatedWage: 12000000 },
  { name: "William Saliba", position: "Defender", age: 23, nationality: "France", club: "Arsenal", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 80000000, estimatedWage: 9000000 },
  { name: "Lamine Yamal", position: "Forward", age: 17, nationality: "Spain", club: "FC Barcelona", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 120000000, estimatedWage: 3000000 },
  { name: "Pedri", position: "Midfielder", age: 21, nationality: "Spain", club: "FC Barcelona", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 80000000, estimatedWage: 9000000 },
  { name: "Gavi", position: "Midfielder", age: 20, nationality: "Spain", club: "FC Barcelona", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 90000000, estimatedWage: 6000000 },
  { name: "Florian Wirtz", position: "Midfielder", age: 21, nationality: "Germany", club: "Bayer Leverkusen", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 130000000, estimatedWage: 4000000 },
  { name: "Jamal Musiala", position: "Midfielder", age: 21, nationality: "Germany", club: "Bayern Munich", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 120000000, estimatedWage: 5000000 },
  { name: "Harry Kane", position: "Forward", age: 31, nationality: "England", club: "Bayern Munich", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 100000000, estimatedWage: 25000000 },
  { name: "Warren Zaïre-Emery", position: "Midfielder", age: 18, nationality: "France", club: "Paris Saint-Germain", contractExpiry: "2029-06-30T00:00:00Z", marketValue: 60000000, estimatedWage: 4000000 },
  { name: "Xavi Simons", position: "Midfielder", age: 21, nationality: "Netherlands", club: "RB Leipzig", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 80000000, estimatedWage: 5000000 },
  { name: "Lautaro Martínez", position: "Forward", age: 27, nationality: "Argentina", club: "Inter Milan", contractExpiry: "2029-06-30T00:00:00Z", marketValue: 110000000, estimatedWage: 12000000 },
  { name: "Rafael Leão", position: "Forward", age: 25, nationality: "Portugal", club: "AC Milan", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 90000000, estimatedWage: 7000000 },
  { name: "Khvicha Kvaratskhelia", position: "Forward", age: 23, nationality: "Georgia", club: "AC Milan", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 80000000, estimatedWage: 2000000 },
  { name: "Victor Osimhen", position: "Forward", age: 25, nationality: "Nigeria", club: "Inter Milan", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 100000000, estimatedWage: 10000000 },
  { name: "Bruno Guimarães", position: "Midfielder", age: 26, nationality: "Brazil", club: "Newcastle United", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 85000000, estimatedWage: 8000000 },
  { name: "Alexander Isak", position: "Forward", age: 24, nationality: "Sweden", club: "Newcastle United", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 75000000, estimatedWage: 6000000 },
  { name: "Declan Rice", position: "Midfielder", age: 25, nationality: "England", club: "Arsenal", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 120000000, estimatedWage: 12000000 },
  { name: "Enzo Fernández", position: "Midfielder", age: 23, nationality: "Argentina", club: "Chelsea", contractExpiry: "2032-06-30T00:00:00Z", marketValue: 75000000, estimatedWage: 9000000 },
  { name: "Cole Palmer", position: "Midfielder", age: 22, nationality: "England", club: "Chelsea", contractExpiry: "2030-06-30T00:00:00Z", marketValue: 80000000, estimatedWage: 4000000 },
  { name: "Moises Caicedo", position: "Midfielder", age: 22, nationality: "Ecuador", club: "Chelsea", contractExpiry: "2031-06-30T00:00:00Z", marketValue: 75000000, estimatedWage: 8000000 },
  { name: "Kobbie Mainoo", position: "Midfielder", age: 19, nationality: "England", club: "Manchester United", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 50000000, estimatedWage: 2000000 },
  { name: "Rasmus Højlund", position: "Forward", age: 21, nationality: "Denmark", club: "Manchester United", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 65000000, estimatedWage: 5000000 },
  { name: "Bruno Fernandes", position: "Midfielder", age: 30, nationality: "Portugal", club: "Manchester United", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 70000000, estimatedWage: 14000000 },
  { name: "Trent Alexander-Arnold", position: "Defender", age: 25, nationality: "England", club: "Liverpool", contractExpiry: "2025-06-30T00:00:00Z", marketValue: 70000000, estimatedWage: 9000000 },
  { name: "Alexis Mac Allister", position: "Midfielder", age: 25, nationality: "Argentina", club: "Liverpool", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 75000000, estimatedWage: 8000000 },
  { name: "Mohamed Salah", position: "Forward", age: 32, nationality: "Egypt", club: "Liverpool", contractExpiry: "2025-06-30T00:00:00Z", marketValue: 55000000, estimatedWage: 20000000 },
  { name: "Son Heung-min", position: "Forward", age: 32, nationality: "South Korea", club: "Tottenham Hotspur", contractExpiry: "2025-06-30T00:00:00Z", marketValue: 45000000, estimatedWage: 10000000 },
  { name: "Cristian Romero", position: "Defender", age: 26, nationality: "Argentina", club: "Tottenham Hotspur", contractExpiry: "2027-06-30T00:00:00Z", marketValue: 65000000, estimatedWage: 8000000 },
  { name: "Ollie Watkins", position: "Forward", age: 28, nationality: "England", club: "Aston Villa", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 65000000, estimatedWage: 6000000 },
  { name: "Douglas Luiz", position: "Midfielder", age: 26, nationality: "Brazil", club: "Juventus", contractExpiry: "2029-06-30T00:00:00Z", marketValue: 70000000, estimatedWage: 6000000 },
  { name: "Dusan Vlahovic", position: "Forward", age: 24, nationality: "Serbia", club: "Juventus", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 65000000, estimatedWage: 12000000 },
  { name: "Antoine Griezmann", position: "Forward", age: 33, nationality: "France", club: "Atletico Madrid", contractExpiry: "2026-06-30T00:00:00Z", marketValue: 25000000, estimatedWage: 12000000 },
  { name: "Jan Oblak", position: "Goalkeeper", age: 31, nationality: "Slovenia", club: "Atletico Madrid", contractExpiry: "2028-06-30T00:00:00Z", marketValue: 28000000, estimatedWage: 10000000 }
];

const players = playersData.map(p => {
  const { club, ...rest } = p;
  return { id: uuid(), ...rest, currentClubId: clubMap[club] };
});
const playerMap = {};
players.forEach(p => playerMap[p.name] = p.id);

fs.writeFileSync('scripts/seed/data/players.json', JSON.stringify(players, null, 2));

const sourcesData = [
  { name: "Fabrizio Romano", reliabilityWeight: 0.95 },
  { name: "David Ornstein", reliabilityWeight: 0.98 },
  { name: "Gianluca Di Marzio", reliabilityWeight: 0.85 },
  { name: "Florian Plettenberg", reliabilityWeight: 0.88 },
  { name: "Matteo Moretto", reliabilityWeight: 0.80 },
  { name: "Gerard Romero", reliabilityWeight: 0.75 },
  { name: "Santi Aouna", reliabilityWeight: 0.70 },
  { name: "The Athletic Aggregator", reliabilityWeight: 0.50 }
];

const sources = sourcesData.map(s => ({ id: uuid(), ...s }));
const sourceMap = {};
sources.forEach(s => sourceMap[s.name] = s.id);

fs.writeFileSync('scripts/seed/data/sources.json', JSON.stringify(sources, null, 2));

// Rumors (30)
const rumors = [];
const rumorStatuses = ["RUMOR", "ADVANCED_TALKS", "AGREED", "COMPLETED", "DENIED", "DEAD"];

for (let i = 0; i < 30; i++) {
  const player = players[i % players.length];
  const possibleToClubs = clubs.filter(c => c.id !== player.currentClubId);
  const toClub = possibleToClubs[i % possibleToClubs.length];
  const status = rumorStatuses[i % rumorStatuses.length];
  const rId = uuid();
  
  const sourcesForRumor = [];
  const numSources = (i % 3) + 1; // 1 to 3 sources
  for(let j=0; j<numSources; j++) {
     sourcesForRumor.push({
       id: uuid(),
       sourceId: sources[(i+j) % sources.length].id,
       reportedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
     });
  }

  rumors.push({
    id: rId,
    playerId: player.id,
    fromClubId: player.currentClubId,
    toClubId: toClub.id,
    status: status,
    reportedFee: (Math.floor(Math.random() * 50) + 30) * 1000000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reports: sourcesForRumor
  });
}

fs.writeFileSync('scripts/seed/data/rumors.json', JSON.stringify(rumors, null, 2));

// Transfers (25)
const transfers = [];
for (let i = 0; i < 25; i++) {
  const player = players[(i + 5) % players.length];
  const possibleFromClubs = clubs.filter(c => c.id !== player.currentClubId);
  const fromClub = possibleFromClubs[i % possibleFromClubs.length];
  transfers.push({
    id: uuid(),
    playerId: player.id,
    fromClubId: fromClub.id,
    toClubId: player.currentClubId, // historical transfer to their current club
    fee: (Math.floor(Math.random() * 80) + 20) * 1000000,
    date: new Date(Date.now() - Math.random() * 30000000000).toISOString(),
    window: i % 2 === 0 ? "2023-summer" : "2024-winter"
  });
}

fs.writeFileSync('scripts/seed/data/transfer_history.json', JSON.stringify(transfers, null, 2));
