import { prisma } from '../backend/src/prisma';

async function main() {
  await prisma.player.updateMany({
    where: { name: "Marc Cucurella" },
    data: { bannerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d2/London_Wembley.jpg" }
  });
  await prisma.player.updateMany({
    where: { name: "Victor Muñoz" },
    data: { bannerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/Panorama_of_Anfield_with_new_main_stand_%2829676137824%29.jpg" }
  });
  await prisma.player.updateMany({
    where: { name: "Nick Pope" },
    data: { bannerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1a/2023_07_31_arne_mueseler_00060-Verbessert-RR_%2853106651455%29.jpg" }
  });
  await prisma.player.updateMany({
    where: { name: "Ismael Saibari" },
    data: { bannerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Allianz_Arena_2008-02-09.jpg" }
  });
  await prisma.player.updateMany({
    where: { name: "Yan Diomande" },
    data: { bannerImageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/Stadio_Meazza_2021_3.jpg" }
  });
  console.log("Updated banners successfully with 4K stadiums.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
