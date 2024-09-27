import { NextResponse } from 'next/server';
import GroupMembers from '@/app/models/GroupMember';
import Group from '@/app/models/Group';
import { Op } from 'sequelize';

export async function POST(req: Request, { params }: { params: { groupId: string } }) {
  const { groupId } = params;
  let userId;

  try {
    const body = await req.json();
    userId = body.userId;
    const newAdminId = body.newAdminId; // L'ID du nouvel administrateur

    if (!groupId || !userId) {
      return NextResponse.json({ error: 'ID de groupe ou utilisateur manquant' }, { status: 400 });
    }

    // Vérifier si l'utilisateur est membre du groupe
    const userMembership = await GroupMembers.findOne({
      where: {
        group_id: groupId,
        user_id: userId,
      },
    });

    if (!userMembership) {
      return NextResponse.json({ error: "Vous n'êtes pas membre de ce groupe ou le groupe n'existe pas" }, { status: 404 });
    }

    const isAdmin = userMembership.role === 'admin';

    if (isAdmin) {
      // Récupérer les autres membres du groupe (exclure l'utilisateur actuel)
      const otherMembers = await GroupMembers.findAll({
        where: {
          group_id: groupId,
          user_id: { [Op.ne]: userId },
        },
      });

      if (otherMembers.length === 0) {
        // Si aucun autre membre, supprimer tous les membres du groupe puis le groupe
        await GroupMembers.destroy({
          where: { group_id: groupId },
        });

        await Group.destroy({
          where: { id: groupId },
        });

        return NextResponse.json({ message: 'Le groupe a été supprimé car vous étiez le dernier membre.' }, { status: 200 });
      }

      // Si un nouvel admin est défini
      if (newAdminId) {
        // Assigner le rôle d'admin au nouveau membre
        await GroupMembers.update(
          { role: 'admin' },
          { where: { user_id: newAdminId, group_id: groupId } }
        );
      }

      // Supprimer l'utilisateur actuel du groupe après transfert
      await GroupMembers.destroy({
        where: {
          group_id: groupId,
          user_id: userId,
        },
      });

      return NextResponse.json({
        message: 'Vous avez transféré l\'administration et quitté le groupe avec succès.',
      }, { status: 200 });
    }

    // Si l'utilisateur n'est pas admin, quitter normalement
    const result = await GroupMembers.destroy({
      where: {
        group_id: groupId,
        user_id: userId,
      },
    });

    if (result === 0) {
      return NextResponse.json({ error: "Vous n'êtes pas membre de ce groupe ou le groupe n'existe pas" }, { status: 404 });
    }

    return NextResponse.json({ message: 'Vous avez quitté le groupe avec succès.' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du membre du groupe:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du membre du groupe.' }, { status: 500 });
  }
}
