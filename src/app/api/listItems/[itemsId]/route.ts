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

export async function PUT(req: Request, { params }: { params: { itemsId: string } }) {
    const { itemsId } = params;
    console.log("ID de l'article à mettre à jour :", itemsId);

    try {
        const item = await ListItem.findByPk(itemsId); 
        console.log("Article à mettre à jour :", item);

        if (!item) {
            return NextResponse.json({ error: "Article introuvable." }, { status: 404 });
        }

        // Extraire et valider les données de la requête
        const { name, quantity, category_id, checked } = await req.json();

        // Ajout de logs pour vérifier si les valeurs sont bien extraites
        console.log("Données reçues dans listItems  :", { name, quantity, category_id, checked });

        // Vérifier si les données existent avant de mettre à jour
        const updatedData: { [key: string]: unknown } = {};
        if (name !== undefined) updatedData.name = name;
        if (quantity !== undefined) updatedData.quantity = quantity;
        if (category_id !== undefined) updatedData.category_id = category_id;
        if (checked !== undefined) updatedData.checked = checked;

        // Mettre à jour uniquement les champs fournis
        await item.update({
            ...updatedData,
            updated_at: new Date(),
        });

        return NextResponse.json({ message: "Article mis à jour avec succès." }, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'article :", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour de l'article." }, { status: 500 });
    }
}