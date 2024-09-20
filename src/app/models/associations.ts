import User from './User';
import Group from './Group';
import GroupMembers from './GroupMember';
import Invitations from './Invitation';

// Associer User et Group
User.hasMany(Group, { foreignKey: 'created_by', as: 'createdGroups' });
Group.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Associer GroupMembers aux Groupes et Utilisateurs
GroupMembers.belongsTo(Group, { foreignKey: 'group_id' });
GroupMembers.belongsTo(User, { foreignKey: 'user_id' });

export { User, Group, GroupMembers, Invitations };