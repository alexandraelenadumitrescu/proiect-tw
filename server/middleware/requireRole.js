const prisma = require('../config/shared.js');

/**
 * Middleware to check if the authenticated user has the required role.
 * @param {string} requiredRole - The role required to access the endpoint.
 * @returns {Function} Express middleware function.
 *
 * Usage:
 *   const requireRole = require('./middleware/requireRole');
 *   router.post('/endpoint', authenticateToken, requireRole('organizer'), handler);
 */
function requireRole(requiredRole) {
  return async function (req, res, next) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
      const roles = await prisma.user_roles.findMany({
        where: { user_id: req.user.userId },
        select: { role_type: true },
      });
      const hasRole = roles.some((r) => r.role_type === requiredRole);
      if (!hasRole) {
        return res.status(403).json({ error: `Required role: ${requiredRole}` });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Role check failed' });
    }
  };
}

module.exports = requireRole;
