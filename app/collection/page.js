import { prisma } from "@/lib/prisma";
import CollectionPage from "@/pages/CollectionPage";

export const dynamic = "force-dynamic";

export default async function Collection() {
  const cards = await prisma.card.findMany({ orderBy: { createdAt: "desc" } });
  const serialized = cards.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));
  return <CollectionPage initialCards={serialized} />;
}
