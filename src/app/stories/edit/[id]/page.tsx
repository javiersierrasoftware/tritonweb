import EditStoryForm from "@/components/EditStoryForm";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function EditStoryPage({ params }: any) {
  const db = await getDb();
  const story = await db
    .collection("stories")
    .findOne({ _id: new ObjectId(params.id) });

  if (!story) {
    return <div className="text-white p-10">Historia no encontrada</div>;
  }

  return (
    <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-8">
      <h1 className="text-3xl font-bold">Editar Historia</h1>
      <EditStoryForm story={JSON.parse(JSON.stringify(story))} />
    </main>
  );
}