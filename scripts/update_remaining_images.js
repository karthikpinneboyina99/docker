const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seed/data/players.json');
const players = require(filePath);

const manualUrls = {
  'Kobbie Mainoo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Kobbie_Mainoo_2024.jpg/400px-Kobbie_Mainoo_2024.jpg',
  'Rasmus Højlund': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Rasmus_H%C3%B8jlund_2024.jpg/400px-Rasmus_H%C3%B8jlund_2024.jpg',
  'Alexis Mac Allister': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Alexis_Mac_Allister.jpg/400px-Alexis_Mac_Allister.jpg',
  'Cristian Romero': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/CutiRomero.jpg/400px-CutiRomero.jpg',
  'Ollie Watkins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Ollie_Watkins_%28cropped%29.jpg/400px-Ollie_Watkins_%28cropped%29.jpg',
  'Douglas Luiz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Douglas_Luiz.jpg/400px-Douglas_Luiz.jpg',
  'Dusan Vlahovic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Du%C5%A1an_Vlahovi%C4%87_2023.jpg/400px-Du%C5%A1an_Vlahovi%C4%87_2023.jpg'
};

let updated = 0;
for (let p of players) {
  if (manualUrls[p.name]) {
    p.imageUrl = manualUrls[p.name];
    updated++;
  } else if (!p.imageUrl) {
    // Ultimate fallback for anyone else
    p.imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=181818&color=f59e0b&size=400`;
    updated++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
console.log(`Updated ${updated} remaining images.`);
