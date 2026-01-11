const prisma = require('../config/shared.js');
const bcrypt = require('bcrypt');

const roles = require('../constants/roles.js');
const DEFAULT_USER_ROLE = roles.DEFAULT_USER_ROLE;

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { email, password_hash: hashedPassword },
    });

    // also add a user role entry with the default role
    const _roleEntry = await prisma.user_roles.create({
      data: {
        user_id: user.id,
        role_type: DEFAULT_USER_ROLE,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
