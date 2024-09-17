import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../../models/User"; // Chemin correct vers ton modèle User
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Importation des options d'auth

export async function POST(req: NextRequest) {
    // Créer un objet "request" et "response" attendu par getServerSession
    const session = await getServerSession({ req, res: NextResponse, ...authOptions });
  
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  
    const { oldPassword, newPassword } = await req.json();
  
    // Trouver l'utilisateur dans la base de données via son email
    const user = await User.findOne({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  
    const isPasswordValid = await bcrypt.compare(oldPassword, user.get('password') as string);
if (!isPasswordValid) {
  return NextResponse.json({ message: "Old password is incorrect" }, { status: 403 });
}
  
    // Hashage du nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
    // Mise à jour dans la base de données
    user.set('password', hashedNewPassword); // Utilise user.set pour définir le nouveau mot de passe
    await user.save();
  
    return NextResponse.json({ message: "Password updated successfully" });
  }