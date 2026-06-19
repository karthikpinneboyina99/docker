import { prisma } from '../backend/src/prisma';

async function main() {
  await prisma.player.updateMany({
    where: { name: "Marc Cucurella" },
    data: { bannerImageUrl: "https://images.unsplash.com/photo-1518605368461-1eb5fb84333b?auto=format&fit=crop&q=80&w=2000" }
  });
  await prisma.player.updateMany({
    where: { name: "Victor Muñoz" },
    data: { bannerImageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=2000" }
  });
  await prisma.player.updateMany({
    where: { name: "Nick Pope" },
    data: { bannerImageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=2000" }
  });
  await prisma.player.updateMany({
    where: { name: "Ismael Saibari" },
    data: { bannerImageUrl: "https://images.unsplash.com/photo-1431324155629-1a6d0a11f472?auto=format&fit=crop&q=80&w=2000" }
  });
  await prisma.player.updateMany({
    where: { name: "Yan Diomande" },
    data: { bannerImageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000" }
  });
  console.log("Updated banners successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
