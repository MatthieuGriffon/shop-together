import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../lib/sequelize';
import Group from './Group';
import User from './User';

// Interface pour typer les attributs d'une invitation
interface InvitationAttributes {
  id: string;
  group_id: string;
  invited_by: string;
  email:  null;
  token: string;
  status: string;
  created_at?: Date;
  expires_at?: Date;
  used_at?: Date | null;
}

// Interface pour les attributs lors de la création
interface InvitationCreationAttributes extends Optional<InvitationAttributes, 'id' | 'status' | 'created_at' | 'used_at'> {}

// Modèle Sequelize pour la table des invitations
class Invitation extends Model<InvitationAttributes, InvitationCreationAttributes> implements InvitationAttributes {
  public id!: string;
  public group_id!: string;
  public invited_by!: string;
  public email!: null;
  public token!: string;
  public status!: string;
  public created_at!: Date;
  public expires_at!: Date;
  public used_at!: Date | null;

  // Définition des associations (Sequelize)
  static associate() {
    Invitation.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });
    Invitation.belongsTo(User, { foreignKey: 'invited_by', as: 'inviter' });
  }
}

// Initialisation du modèle avec Sequelize
Invitation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    group_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    invited_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,  // Champ nullable
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    used_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Invitations',
    timestamps: false, // Sequelize ne gère pas les timestamps automatiquement ici
    underscored: true,
  }
);

// Créer les associations entre modèles après l'initialisation de tous les modèles
Invitation.associate();

export default Invitation;