import { NextResponse } from 'next/server';
import Group from '../../models/Group'; // Modèles Sequelize
import  GroupMembers  from '../../models/GroupMember';


export async function POST(req: Request) {
    try {
      const { name, createdBy }: { name: string; createdBy: string } = await req.json();
  
      if (!name || !createdBy) {
        return NextResponse.json({ error: 'Le nom du groupe et l\'ID du créateur sont requis.' }, { status: 400 });
      }
  
      const newGroup = await Group.create({
        name,
        created_by: createdBy,
      });
  
      await GroupMembers.create({
        id: newGroup.id, // Assuming id is the same as newGroup.id
        group_id: newGroup.id,
        user_id: createdBy,
        role: 'admin',
        joined_at: new Date(), // Assuming joined_at is the current date
      });
  
      return NextResponse.json({ message: 'Groupe créé avec succès', group: newGroup }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Erreur lors de la création du groupe.' }, { status: 500 });
    }
  }