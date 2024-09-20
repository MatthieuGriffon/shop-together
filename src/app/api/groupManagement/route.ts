import { NextResponse } from 'next/server';
import { GroupMembers, User } from '../../models/associations';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const groupId = url.searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json({ error: 'groupId est requis' }, { status: 400 });
    }

    // Récupérer les membres du groupe spécifique
    const groupMembers = await GroupMembers.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // Informations du membre
        },
      ],
    });

    if (!groupMembers.length) {
      return NextResponse.json({ message: 'Aucun membre trouvé' }, { status: 200 });
    }

    return NextResponse.json(groupMembers, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des membres du groupe:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}