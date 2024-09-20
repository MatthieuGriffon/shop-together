import { NextResponse } from 'next/server';
import  Invitations from '../../models/Invitation'; 
import User from '../../models/User';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { groupId, invitedBy } = await req.json();

    // Vérifier si invitedBy est un utilisateur OAuth
    let actualUserId = invitedBy;

    const oauthUser = await User.findOne({
      where: { oauth_id: invitedBy } // Rechercher dans la table User par oauth_id
    });

    if (oauthUser) {
      actualUserId = oauthUser.get('id'); // Récupérer l'UUID associé
    }

    // Générer un token unique
    const token = uuidv4();

    // Définir une date d'expiration (par exemple 7 jours)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Enregistrer l'invitation dans la base de données
    await Invitations.create({
      id: uuidv4(),
      group_id: groupId,
      invited_by: actualUserId, 
      token,
      expires_at: expiresAt,
      status: 'pending',
    });

    // Renvoyer le lien d'invitation
    const invitationLink = `${process.env.APP_URL}/joinGroup/${token}`;
    return NextResponse.json({ link: invitationLink });
  } catch (error) {
    console.error('Erreur lors de la génération du lien d\'invitation:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du lien.' }, { status: 500 });
  }
}