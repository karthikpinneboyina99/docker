const fs = require('fs');
const path = require('path');

const playersPath = path.join(__dirname, 'seed/data/players.json');
const clubsPath = path.join(__dirname, 'seed/data/clubs.json');

const players = require(playersPath);
const clubs = require(clubsPath);

const playerBanners = {
  'Kylian Mbappé': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Kylian_Mbapp%C3%A9_%2846369981091%29.jpg/1920px-Kylian_Mbapp%C3%A9_%2846369981091%29.jpg',
  'Vinícius Júnior': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/VINICIUS_JUNIOR%2C_Ismael_SAIBARI%2C_Issa_Diopand%2C_and_Ayyoub_BOUADDI_at_2026_FIFA_World_Cup_by_YantsImages.jpg/1920px-VINICIUS_JUNIOR%2C_Ismael_SAIBARI%2C_Issa_Diopand%2C_and_Ayyoub_BOUADDI_at_2026_FIFA_World_Cup_by_YantsImages.jpg',
  'Erling Haaland': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Erling_Haaland_Morocco_v_Norway_7_June_2026-164.jpg/1920px-Erling_Haaland_Morocco_v_Norway_7_June_2026-164.jpg',
  'Phil Foden': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Fulham_vs_Manchester_City%2C_11_May_2024_%288%29.jpg/1920px-Fulham_vs_Manchester_City%2C_11_May_2024_%288%29.jpg'
};

const clubBanners = {
  'Real Madrid': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000&auto=format&fit=crop',
  'Manchester City': 'https://images.unsplash.com/photo-1518605368461-1eb5fb84333b?q=80&w=2000&auto=format&fit=crop',
  'Paris Saint-Germain': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop',
  'Bayern Munich': 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2000&auto=format&fit=crop',
  'Barcelona': 'https://images.unsplash.com/photo-1551280857-2b9ebf41d3cb?q=80&w=2000&auto=format&fit=crop'
};

for (const player of players) {
  if (playerBanners[player.name]) {
    player.bannerImageUrl = playerBanners[player.name];
  }
}

for (const club of clubs) {
  if (clubBanners[club.name]) {
    club.bannerImageUrl = clubBanners[club.name];
  } else {
    // default fallback for clubs just in case
    club.bannerImageUrl = 'https://images.unsplash.com/photo-1518605368461-1eb5fb84333b?q=80&w=2000&auto=format&fit=crop';
  }
}

fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
fs.writeFileSync(clubsPath, JSON.stringify(clubs, null, 2));
console.log('Seed files updated with banner URLs.');
