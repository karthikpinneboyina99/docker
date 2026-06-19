const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed/data/players.json');
const players = require(filePath);

for (let p of players) {
  if (p.name === 'Kobbie Mainoo') {
    p.imageUrl = 'https://images.unsplash.com/photo-1628863640244-a9572b9a7fb3?q=80&w=400&auto=format&fit=crop';
  } else if (p.name === 'Dusan Vlahovic') {
    p.imageUrl = 'https://images.unsplash.com/photo-1518605368461-1eb5fb84333b?q=80&w=400&auto=format&fit=crop';
  }
}

fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
console.log('Fixed final 2 players.');
