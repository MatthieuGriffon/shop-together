import { NextResponse } from "next/server";
import ShoppingList from "@/app/models/ShoppingList";

export async function DELETE(req: Request, { params }: { params: { listId: string } }) {
  const { listId } = params;

  try {
    // Trouver et supprimer la liste de courses
    const list = await ShoppingList.findByPk(listId);

    if (!list) {
      return NextResponse.json({ error: "Liste de courses introuvable." }, { status: 404 });
    }

    await list.destroy();

    return NextResponse.json({ message: "Liste de courses supprimée avec succès." }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression de la liste de courses:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la liste de courses." }, { status: 500 });
  }
}