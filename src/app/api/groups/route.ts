import { NextResponse } from 'next/server';
import Group from '../../models/Group';
import GroupMembers from '../../models/GroupMember';
import User from '../../models/User'; // Assurez-vous d'importer le modèle User

export async function POST(req: Request) {
  try {
    const { name, createdBy }: { name: string; createdBy: string } = await req.json();

    if (!name || !createdBy) {
      return NextResponse.json({ error: 'Le nom du groupe et l\'ID du créateur sont requis.' }, { status: 400 });
    }

    // Vérifier si createdBy est un ID OAuth
    const user = await User.findOne({
      where: { oauth_id: createdBy },
    });

    let actualUserId = createdBy;

    // Si l'utilisateur avec OAuth est trouvé, utiliser son UUID interne
    if (user) {
      actualUserId = user.getDataValue('id'); // Utiliser l'UUID de l'utilisateur
    }

    const newGroup = await Group.create({
      name,
      created_by: actualUserId, // Utiliser l'UUID ici
    });

    await GroupMembers.create({
      id: newGroup.id,
      group_id: newGroup.id,
      user_id: actualUserId, // Utiliser l'UUID ici
      role: 'admin',
      joined_at: new Date(),
    });

    return NextResponse.json({ message: 'Groupe créé avec succès', group: newGroup }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la création du groupe.' }, { status: 500 });
  }
}