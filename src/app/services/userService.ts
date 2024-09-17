import User from '../models/User';  // Import du modèle Sequelize

// Fonction pour récupérer un utilisateur par son ID (UUID ou OAuth ID)
export const getUserById = async (id: string) => {
    try {
      console.log(`Recherche de l'utilisateur avec l'ID : ${id}`);
  
      let user;
  
      // Vérifier si l'ID est un UUID ou un OAuth ID
      if (isUUID(id)) {
        // Si c'est un UUID, on cherche par le champ `id`
        user = await User.findOne({
          where: { id },
          attributes: ['created_at', 'name', 'email', 'profile_picture_url', 'updated_at'],
        });
      } else {
        // Si ce n'est pas un UUID, on cherche par le champ `oauth_id`
        user = await User.findOne({
          where: { oauth_id: id },
          attributes: ['created_at', 'name', 'email', 'profile_picture_url', 'updated_at'],
        });
      }
  
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
  
      return user;
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur : ", error);
      throw error;
    }
  };
  
  // Fonction utilitaire pour vérifier si un ID est un UUID
  const isUUID = (id: string) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
  };