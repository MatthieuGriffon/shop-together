import { NextResponse } from 'next/server';
import GroupMembers from '../../models/GroupMember';
import User from '../../models/User';
import Group from '../../models/Group';

// Interface pour les éléments récupérés
interface GroupMemberWithGroup extends GroupMembers {
  Group: {
    id: string;
    name: string;
    created_by: string;
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId est requis' }, { status: 400 });
    }

    let actualUserId = userId;

    // Vérifier si c'est un utilisateur avec OAuth
    const user = await User.findOne({
      where: { oauth_id: userId }
    });

    if (user) {
      // Si l'utilisateur OAuth est trouvé, on utilise son UUID
      actualUserId = user.get('id') as string;
    } else if (!validateUUID(userId)) {
      // Si ce n'est pas un UUID valide et aucun utilisateur OAuth n'est trouvé
      return NextResponse.json({ error: 'Utilisateur non trouvé ou ID invalide' }, { status: 404 });
    }

    // Récupérer tous les groupes auxquels l'utilisateur appartient avec l'UUID
    const userGroups = await GroupMembers.findAll({
      where: { user_id: actualUserId }, // Utiliser l'UUID ici
      include: [
        {
          model: Group,
          attributes: ['id', 'name', 'created_by'],
        },
      ],
    }) as GroupMemberWithGroup[];

    if (!userGroups.length) {
      return NextResponse.json({ message: 'Aucun groupe trouvé' }, { status: 200 });
    }

    // Structurer les données pour la réponse
    const groups = userGroups.map((groupMember: GroupMemberWithGroup) => ({
      group_id: groupMember.Group.id,
      group_name: groupMember.Group.name,
      created_by: groupMember.Group.created_by,
      role: groupMember.role,
    }));

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// Fonction utilitaire pour valider un UUID
function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
