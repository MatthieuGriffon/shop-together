import { NextResponse } from 'next/server';
import GroupMembers from '../../../models/GroupMember';
import Group from '../../../models/Group';
import User from '../../../models/User'; // Importer le modèle User pour l'utilisateur créateur

// Récupérer les groupes d'un utilisateur donné
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    // Récupérer les GroupMembers pour cet utilisateur
    const userGroups = await GroupMembers.findAll({ 
      where: { user_id: userId },
      include: [
        {
          model: Group,
          as: 'Group', // Assure-toi que l'alias est correct dans tes associations
          include: [
            {
              model: User, // Inclure l'utilisateur qui a créé le groupe
              as: 'creator', // Assure-toi d'utiliser le bon alias pour le créateur
              attributes: ['id', 'name'], // Récupérer uniquement les informations nécessaires
            },
          ],
        },
      ],
    });

    if (!userGroups.length) {
      return NextResponse.json({ message: 'Aucun groupe trouvé' }, { status: 200 });
    }

    // Structurer les groupes avec le créateur
    const groups = userGroups.map((groupMember) => {
      const group = groupMember.Group;
      const creator = group?.creator;

      if (!group) {
        throw new Error(`Le groupe avec l'id ${groupMember.group_id} n'existe pas`);
      }
      
      if (!creator) {
        throw new Error(`Le créateur du groupe avec l'id ${group.id} n'a pas été trouvé`);
      }
      
      return {
        group_id: group.id,
        group_name: group.name,
        role: groupMember.role,
        created_by: creator.name,
      };
    });

    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des groupes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}