const prisma = require('../config/shared.js');
const { VALID_USER_ROLES } = require('../constants/roles.js');

exports.getRolesForUser = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId parameter' });
  }
  try {
    const roles = await prisma.user_roles.findMany({
      where: { user_id: Number(userId) },
      select: { role_type: true },
    });
    res.status(200).json(roles.map((r) => r.role_type));
  } catch (error) {
    console.error('Error fetching roles for user:', error);
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
};

exports.assignRoleToUser = async (req, res) => {
  const userId = req?.user?.id;
  const { role: requestedRole } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'You must be logged in to assign yourself a role' });
  }

  if (!userId || !requestedRole) {
    return res.status(400).json({ error: 'Missing userId or role in request' });
  }

  if (!VALID_USER_ROLES.includes(requestedRole)) {
    return res.status(400).json({ error: 'Requested role is not valid' });
  }

  try {
    // Fetch current roles for user
    const currentRoles = await prisma.user_roles.findMany({
      where: { user_id: Number(userId) },
      select: { role_type: true },
    });
    const currentRoleTypes = currentRoles.map((r) => r.role_type);

    // Check if user already has the requested role
    if (currentRoleTypes.includes(requestedRole)) {
      return res.status(400).json({ error: 'User already has the requested role' });
    }

    // Assign new role
    const createdRole = await prisma.user_roles.create({
      data: { user_id: Number(userId), role_type: requestedRole },
    });

    res.status(201).json({ assigned: createdRole.role_type });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: 'Failed to assign role to user' });
  }
};
