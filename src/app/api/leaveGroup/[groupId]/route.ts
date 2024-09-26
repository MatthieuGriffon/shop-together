import { NextResponse } from 'next/server';

import GroupMembers from '@/app/models/GroupMember';
import Group from '@/app/models/Group';

// Gestion de la requête POST pour quitter le groupe
export async function POST(req: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  let userId;
  console.log('groupId dans le leaveGroup/[groupId]/route.ts:', groupId);

  try {
    const body = await req.json();
    userId = body.userId; // Récupérer l'ID utilisateur depuis le body

    if (!groupId || !userId) {
      console.error('ID de groupe ou utilisateur manquant');
      return NextResponse.json({ error: 'ID de groupe ou utilisateur manquant' }, { status: 400 });
    }

    // Vérifier si l'utilisateur est administrateur
    const userMembership = await GroupMembers.findOne({
      where: {
        group_id: groupId,
        user_id: userId,
      },
    });

    if (!userMembership) {
      console.error("Utilisateur non trouvé dans le groupe ou groupe inexistant");
      return NextResponse.json({ error: "Vous n'êtes pas membre de ce groupe ou le groupe n'existe pas" }, { status: 404 });
    }

    const isAdmin = userMembership.role === 'admin';

    if (isAdmin) {
      // Si l'utilisateur est admin, lister les autres membres du groupe
      const otherMembers = await GroupMembers.findAll({
        where: {
          group_id: groupId,
          user_id: { $ne: userId }, // Exclure l'admin actuel
        },
      });

      if (otherMembers.length === 0) {
        // Si aucun autre membre, supprimer le groupe
        await Group.destroy({
          where: { id: groupId },
        });

        console.log('Groupe supprimé car aucun autre membre');
        return NextResponse.json({ message: 'Le groupe a été supprimé car vous étiez le dernier membre.' }, { status: 200 });
      }

      // Retourner la liste des autres membres pour que l'admin puisse choisir un successeur
      return NextResponse.json({
        message: 'Vous êtes administrateur. Sélectionnez un nouveau admin.',
        members: otherMembers,
      }, { status: 200 });
    }

    // Si l'utilisateur n'est pas admin, quitter le groupe normalement
    const result = await GroupMembers.destroy({
      where: {
        group_id: groupId,
        user_id: userId,
      },
    });

    if (result === 0) {
      console.error("Utilisateur non trouvé dans le groupe ou groupe inexistant");
      return NextResponse.json({ error: "Vous n'êtes pas membre de ce groupe ou le groupe n'existe pas" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vous avez quitté le groupe avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre du groupe:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du membre du groupe.' }, { status: 500 });
  }
}
