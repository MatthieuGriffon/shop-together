import { NextResponse } from "next/server";
import ShoppingList from "@/app/models/ShoppingList";
import User from "@/app/models/User"; // Modèle pour les utilisateurs
import Group from "@/app/models/Group";

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;

  try {
    // Vérifier si le groupe existe
    const group = await Group.findOne({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json({ error: "Le groupe n'existe pas." }, { status: 404 });
    }

    // Récupérer les listes de courses associées à ce groupe
    const shoppingLists = await ShoppingList.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: 'creator', // Alias défini dans ShoppingList
          attributes: ['name'], // Afficher seulement le nom de l'utilisateur qui a créé la liste
        },
      ],
    });

    if (shoppingLists.length === 0) {
      return NextResponse.json({ message: "Aucune liste de courses trouvée pour ce groupe." }, { status: 200 });
    }

    return NextResponse.json(shoppingLists, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des listes de courses:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des listes de courses." }, { status: 500 });
  }
}
