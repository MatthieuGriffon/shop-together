import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import User from "../../../models/User"; // Assure-toi que le chemin est correct

export async function DELETE(req: NextRequest) {
  // Récupérer la session de l'utilisateur
  const session = await getServerSession({ req, res: NextResponse, ...authOptions });
  // Vérifier si l'utilisateur est authentifié
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Supprimer l'utilisateur de la base de données
    await User.destroy({ where: { email: session.user.email } });

    return NextResponse.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    return NextResponse.json({ message: "Erreur lors de la suppression du compte" }, { status: 500 });
  }
}