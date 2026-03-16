import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding tasks...");

  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      { title: "Design system audit", tag: "Adhoc", priority: "High", done: true, dueDate: new Date("2026-03-01") },
      { title: "API integration for auth module", tag: "Adhoc", priority: "High", done: false, dueDate: new Date("2026-03-03") },
      { title: "Write Q1 retrospective doc", tag: "Adhoc", priority: "Medium", done: false, dueDate: new Date("2026-03-05") },
      { title: "Fix pagination bug on dashboard", tag: "Adhoc", priority: "High", done: true, dueDate: new Date("2026-03-02") },
      { title: "Update onboarding flow copy", tag: "Adhoc", priority: "Low", done: false, dueDate: new Date("2026-03-07") },
      { title: "Stakeholder sync call prep", tag: "Adhoc", priority: "Medium", done: false, dueDate: new Date("2026-03-04") },
      { title: "Release v2.3 changelog", tag: "Adhoc", priority: "Low", done: true, dueDate: new Date("2026-03-01") },
      { title: "Performance profiling home route", tag: "Adhoc", priority: "Medium", done: false, dueDate: new Date("2026-03-06") },
    ],
  });

  console.log("Seeded 8 tasks.");
  
    console.log("Seeding cards...");
  await prisma.card.deleteMany();
  await prisma.card.createMany({
    data: [
      { title: "The Master and Margarita", subtitle: "Mikhail Bulgakov", category: "Book", content: "A surreal Soviet-era novel where the devil visits Moscow. Themes of censorship, corruption, and artistic freedom. The scene where Berlioz is decapitated sets the absurdist tone immediately.\n\nFavorite passage: 'Cowardice is the greatest sin.'", tags: ["fiction","russian","surrealism"], spineColor: "#8b4513", isFavorite: true },
      { title: "Backpacking through Kyoto", subtitle: "March 2024", category: "Experience", content: "Three days of temples and matcha. Fushimi Inari at 5am with no tourists — just lanterns and silence. The bamboo grove at Arashiyama was overrated but the small teahouse beside it was perfect.\n\nBest discovery: Nishiki Market's pickled plum vendors.", tags: ["travel","japan","2024"], spineColor: "#2d6a4f", isFavorite: true },
      { title: "Brutalist Architecture Zines", subtitle: "Ongoing collection", category: "Collection", content: "Self-published photobooks documenting brutalist buildings across Eastern Europe. Currently 14 volumes. Focus on Hungary, Poland, and former Yugoslavia.\n\nMost prized: a 1978 Hungarian government pamphlet on the cultural house in Dunaújváros.", tags: ["architecture","zines","brutalism"], spineColor: "#4a4e69" },
      { title: "Thinking, Fast and Slow", subtitle: "Daniel Kahneman", category: "Book", content: "System 1 vs System 2 thinking. The most useful framework for understanding human irrationality. Loss aversion chapter completely changed how I negotiate.\n\nKey insight: We are not the rational actors economics assumes. We are storytellers who pick the most coherent narrative.", tags: ["psychology","economics","nonfiction"], spineColor: "#c77dff" },
      { title: "Learning to throw pottery", subtitle: "Winter 2023", category: "Experience", content: "Six-week course at a small studio. Failed at centering clay for three weeks straight. The moment it clicked was indescribable — like the clay and hands were one system.\n\nTook home two lopsided bowls I use every day. Imperfection as intimacy.", tags: ["craft","learning","2023"], spineColor: "#e07a5f" },
      { title: "Vintage Film Photography", subtitle: "35mm & 120 format", category: "Collection", content: "Around 60 rolls shot on various cameras. Favorites: Olympus OM-1, Yashica Mat-124G for medium format. Mostly Kodak Gold 200 and Ilford HP5.\n\nThe waiting is the point. You can't chimp film. Forces intentionality.", tags: ["photography","analog","film"], spineColor: "#f4a261" },
      { title: "Meditations", subtitle: "Marcus Aurelius", category: "Book", content: "A Roman emperor's private journal, never meant for publication. The most honest stoic text because it's not performing for an audience — it's someone trying to be better.\n\n'You have power over your mind, not outside events. Realize this and you will find strength.'", tags: ["philosophy","stoicism","classics"], spineColor: "#264653" },
      { title: "Solo train across Vietnam", subtitle: "2022 — Hanoi to Saigon", category: "Experience", content: "The Reunification Express over 4 days. Watching the landscape shift from paddy fields to coastline to delta. Shared a cabin with a family who gave me jackfruit and didn't speak a word of English.\n\nBest meal: Bánh mì from a station platform at 6am.", tags: ["travel","vietnam","2022"], spineColor: "#d4a373" },
    ],
  });
  console.log("Seeded 8 cards.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
