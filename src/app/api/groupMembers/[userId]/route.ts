import { NextResponse } from 'next/server';
import { GroupMembers, Group, User } from '../../../models/associations';

// Interface pour les éléments récupérés
interface GroupMemberWithGroup extends GroupMembers {
  Group: {
    id: string;
    name: string;
    created_by: string;
    creator: {
      name: string; // Le nom du créateur
    };
  };
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } } // On récupère les paramètres dynamiques ici
) {
  try {
    const { userId } = params;

    let actualUserId = userId;

    // Vérifier si c'est un utilisateur OAuth
    const oauthUser = await User.findOne({
      where: { oauth_id: userId },
    });

    if (oauthUser) {
      actualUserId = oauthUser.get('id') as string;
    } else if (!validateUUID(userId)) {
      return NextResponse.json({ error: 'Utilisateur non trouvé ou ID invalide' }, { status: 404 });
    }

    const userGroups = await GroupMembers.findAll({
      where: { user_id: actualUserId },
      include: [
        {
          model: Group,
          attributes: ['id', 'name', 'created_by'],
          include: [
            {
              model: User,
              as: 'creator', // Utiliser l'alias 'creator'
              attributes: ['name'], // Obtenir uniquement le nom du créateur
            },
          ],
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
      created_by: groupMember.Group.creator?.name || 'Inconnu', // Vérification de la nullité
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