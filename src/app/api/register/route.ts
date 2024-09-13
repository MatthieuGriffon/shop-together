import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '../../models/User'; // Importer ton modèle User

// Gestion des requêtes POST pour enregistrer un utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name,email, password } = body;

    // Vérification des champs
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nom d\'utilisateur, email et mot de passe sont requis.' },
        { status: 400 }
      );
    }

        // Vérifie si l'utilisateur ou le nom d'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        const existingName = await User.findOne({ where: { name } });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Cet utilisateur existe déjà.' },
        { status: 400 }
      );
    } 
    if (existingName) {
        return NextResponse.json(
          { message: 'Ce nom d\'utilisateur est déjà pris.' },
          { status: 400 }
        );
      }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      await User.create({
        name,          // Utilise "name" comme nom d'utilisateur
        email,
        password: hashedPassword,
      });
  
      return NextResponse.json(
        { message: 'Utilisateur créé avec succès.' },
        { status: 201 }
      );
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      return NextResponse.json(
        { message: 'Erreur lors de l\'inscription.' },
        { status: 500 }
      );
    }
  }
  