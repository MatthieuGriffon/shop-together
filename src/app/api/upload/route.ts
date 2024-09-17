import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import User from '../../models/User'; // Modèle Sequelize

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as Blob | null;
  const userId = formData.get('userId') as string;

  if (!file || !userId) {
    return NextResponse.json({ error: 'File or user ID missing' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${(file as File).name}`;
  const filePath = path.join(process.cwd(), 'public/uploads', fileName);
  await fs.writeFile(filePath, buffer);

  try {
    // Mise à jour de l'URL de la photo de profil dans la base de données
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    user.set('profile_picture_url', `/uploads/${fileName}`);
    await user.save();

    return NextResponse.json({ message: 'Image uploaded successfully', filePath: `/uploads/${fileName}` });
  } catch (error) {
    console.error('Error updating user with profile URL:', error);
    return NextResponse.json({ error: 'Failed to update profile picture' }, { status: 500 });
  }
}