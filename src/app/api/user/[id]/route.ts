import { NextResponse } from 'next/server';
import { getUserById } from '../../../services/userService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(params.id);  // Utilise la fonction qui gère UUID et OAuth ID
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      name: user.get('name'),
      email: user.get('email'),
      profilePictureUrl: user.get('profile_picture_url'), 
      createdAt: user.get('created_at'),
      updated_at: user.get('updated_at'),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}