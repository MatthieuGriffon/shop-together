import { NextResponse } from "next/server";
import ListItem from "@/app/models/ListItem";

export async function DELETE(req: Request, { params }: { params: { itemsId: string } }) {
  const { itemsId } = params; // Correction ici : itemsId
  console.log("ID de l'article à supprimer :", itemsId);

  try {
    const item = await ListItem.findByPk(itemsId); // Utiliser itemsId pour trouver l'article
    console.log("Article à supprimer :", item);

    if (!item) {
      return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
    }

    await item.destroy();

    return NextResponse.json({ message: "Article supprimé avec succès." }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de l'article." }, { status: 500 });
  }
}

