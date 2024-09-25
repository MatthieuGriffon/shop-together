import { NextResponse } from 'next/server';
import GroupMembers from '../../../../models/GroupMember';
import User from '../../../../models/User';

export async function GET(req: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action'); // Utiliser un paramètre pour différencier l'action

  try {
    if (action === 'members') {
      // Récupérer les membres d'un groupe spécifique avec les infos de la date de jointure
      const groupMembers = await GroupMembers.findAll({
        where: { group_id: groupId },
        include: [
          {
            model: User,
            as: 'User',
            attributes: ['id', 'name', 'email'], // Informations du membre
          },
        ],
        attributes: ['user_id', 'role', 'joined_at'], // Inclure 'joined_at'
      }) as Array<{
        get: (key: 'user_id' | 'role' | 'joined_at') => string | number;
        User?: { get: (key: 'name' | 'email') => string };
      }>;

      console.log(groupMembers);

      if (!groupMembers.length) {
        return NextResponse.json({ message: 'Aucun membre trouvé' }, { status: 200 });
      }

      // Structurer les données pour la réponse
      const members = groupMembers.map((member) => ({
        id: member.get('user_id'),
        name: member.User?.get('name') || 'Inconnu',
        email: member.User?.get('email') || 'Inconnu',
        role: member.get('role'),
        joined_at: member.get('joined_at'), // Ajouter la date de jointure
      }));
      console.log('Members du group/[groupId]/route.ts',members);

      return NextResponse.json(members, { status: 200 });
    }

    // Gestion d'autres actions ou retour par défaut
    return NextResponse.json({ message: 'Action inconnue' }, { status: 400 });

  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
