import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NextResponse } from "next/server";
import ListItem from "@/app/models/ListItem";
import ShoppingList from "@/app/models/ShoppingList";

export async function POST(req: Request) {
  try {
    const res = NextResponse.next();
    const session = await getServerSession({ req, res, ...authOptions });
    console.log("Session Backend avec authOptions :", session);
    if (session && session.user) {
      console.log("ID utilisateur :", session.user.id);
    }

    // Vérifier si la session et l'ID utilisateur sont valides
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { list_id, name, quantity, category_id } = await req.json();
    console.log("Données reçues dans listItems  :", {
      list_id,
      name,
      quantity,
      category_id,
    });

    // Vérification de l'existence de la liste
    const shoppingList = await ShoppingList.findOne({
      where: { id: list_id },
    });

    if (!shoppingList) {
      return NextResponse.json(
        { error: "Liste de courses introuvable" },
        { status: 404 }
      );
    }

    // Ajouter l'article dans la base de données
    const newItem = await ListItem.create({
      list_id,
      name,
      quantity,
      category_id,
      added_by: session.user.id,
      checked: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'article:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'article." },
      { status: 500 }
    );
  }
}
