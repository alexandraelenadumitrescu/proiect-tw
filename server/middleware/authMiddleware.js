const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader. split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    req.user = { id: 1, email: 'test@example.com' };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user. role)) {
      return res. status(403).json({
        success: false,
        message:  'Access denied - insufficient permissions',
      });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
