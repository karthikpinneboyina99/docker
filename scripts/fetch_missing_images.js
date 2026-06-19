const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed/data/players.json');
const players = require(filePath);

async function fetchWikiImage(playerName) {
  try {
    // Some manual mapping for tricky names
    const nameMap = {
      'Warren Zaïre-Emery': 'Warren Zaïre-Emery',
      'Rafael Leão': 'Rafael Leão',
      'Khvicha Kvaratskhelia': 'Khvicha Kvaratskhelia',
      'Moises Caicedo': 'Moisés Caicedo',
      'Cristian Romero': 'Cristian Romero (footballer, born 1998)',
      'Ollie Watkins': 'Ollie Watkins',
      'Douglas Luiz': 'Douglas Luiz'
    };
    
    const queryName = nameMap[playerName] || playerName;
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(queryName)}&pithumbsize=400&format=json`;
    
    const res = await fetch(searchUrl);
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
    console.error(`Error fetching for ${playerName}:`, error);
    return null;
  }
}

async function main() {
  let updatedCount = 0;
  for (let player of players) {
    if (!player.imageUrl) {
      console.log(`Fetching image for ${player.name}...`);
      const url = await fetchWikiImage(player.name);
      if (url) {
        player.imageUrl = url;
        console.log(`Found: ${url}`);
        updatedCount++;
      } else {
        console.log(`No image found for ${player.name}`);
      }
      // Delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
    console.log(`\nUpdated ${updatedCount} player images.`);
  } else {
    console.log('\nNo new images were found/updated.');
  }
}

main();
