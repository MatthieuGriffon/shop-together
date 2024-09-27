import { NextResponse } from 'next/server';
import ShoppingList from '@/app/models/ShoppingList'; // Modèle pour les listes de courses

export async function POST(req: Request) {
  try {
    const { name, groupId, createdBy } = await req.json();

    if (!name || !groupId || !createdBy) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
    }

    // Créer la nouvelle liste de courses
    const newList = await ShoppingList.create({
      name,
      group_id: groupId,
      created_by: createdBy,
    });

    return NextResponse.json({ message: "Liste de courses créée avec succès", list: newList }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la liste de courses:", error);
    return NextResponse.json({ error: "Erreur lors de la création de la liste de courses." }, { status: 500 });
  }
}
