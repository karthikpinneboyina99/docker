const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed/data/players.json');
const players = require(filePath);

const targetPlayers = [
  'Kobbie Mainoo',
  'Rasmus Højlund',
  'Alexis Mac Allister',
  'Cristian Romero',
  'Ollie Watkins',
  'Douglas Luiz',
  'Dusan Vlahovic'
];

async function fetchWikiImage(playerName) {
  try {
    const queryName = playerName;
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(queryName)}&pithumbsize=400&format=json`;
    
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'FootTalksBot/1.0 (contact@example.com)'
      }
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching for ${playerName}:`, error.message);
    return null;
  }
}

async function main() {
  let updatedCount = 0;
  for (let player of players) {
    if (targetPlayers.includes(player.name)) {
      console.log(`Fetching image for ${player.name}...`);
      const url = await fetchWikiImage(player.name);
      if (url) {
        player.imageUrl = url;
        console.log(`Found: ${url}`);
        updatedCount++;
      } else {
        // Safe fallback placeholder
        player.imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=181818&color=f59e0b&size=400`;
        console.log(`Fallback for ${player.name}`);
        updatedCount++;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
    console.log(`\nUpdated ${updatedCount} player images.`);
  }
}

main();
