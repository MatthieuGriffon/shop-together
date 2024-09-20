import { NextResponse } from "next/server";
import { Invitations, GroupMembers, User } from "../../models/associations"; // Associez GroupMembers et Invitations
import { v4 as uuidv4 } from "uuid";
import { isUUID } from "validator"; // Ajout d'une bibliothèque pour valider les UUID

export async function POST(req: Request) {
  try {
    const { token, userId } = await req.json();

    // Vérifier si l'invitation existe et est valide
    const invitation = await Invitations.findOne({ where: { token } });
    if (!invitation) {
      return NextResponse.json({ error: "Invitation invalide." }, { status: 404 });
    }

    // Vérifier si l'invitation a expiré
    const now = new Date();
    if (invitation.expires_at && now > invitation.expires_at) {
      return NextResponse.json({ error: "Invitation expirée." }, { status: 400 });
    }

    // Vérification si l'userId est un UUID ou un oauth_id
    let user;
    if (isUUID(userId)) {
      // Chercher l'utilisateur par UUID (id)
      user = await User.findOne({ where: { id: userId } });
    } else {
      // Chercher l'utilisateur par oauth_id
      user = await User.findOne({ where: { oauth_id: userId } });
    }

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    // Ajouter l'utilisateur au groupe
    await GroupMembers.create({
      id: uuidv4(),
      group_id: invitation.group_id,
      user_id: user.getDataValue('id'), // Utiliser l'UUID de l'utilisateur
      role: "member", // Par défaut, le nouveau membre est un simple utilisateur
      joined_at: new Date(),
    });

    // Marquer l'invitation comme utilisée
    invitation.status = "used";
    invitation.used_at = new Date();
    await invitation.save();

    return NextResponse.json({ message: "Vous avez rejoint le groupe avec succès." });
  } catch (error) {
    console.error("Erreur lors de la validation de l'invitation:", error);
    return NextResponse.json({ error: "Erreur lors de la validation de l'invitation." }, { status: 500 });
  }
}