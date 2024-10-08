import { NextResponse } from 'next/server';
import GroupMembers from '@/app/models/GroupMember';
import User from '@/app/models/User';

interface Params {
  groupId: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { groupId } = params;

    if (!groupId) {
      return NextResponse.json({ error: 'groupId est requis' }, { status: 400 });
    }

    // Récupérer les membres du groupe spécifique
    const groupMembers = await GroupMembers.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: 'User', // Spécifier l'alias correct ici
          attributes: ['id', 'name', 'email'], // Informations du membre
        },
      ],
    });

    if (!groupMembers.length) {
      return NextResponse.json({ message: 'Aucun membre trouvé' }, { status: 200 });
    }

    return NextResponse.json(groupMembers, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres du groupes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
