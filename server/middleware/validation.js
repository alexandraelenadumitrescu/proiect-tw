const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password. length >= 8;
};

const validateRegistration = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }

  if (!password || ! validatePassword(password)) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  if (!firstName || !lastName) {
    return res.status(400).json({ success: false, message: 'First name and last name are required' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req. body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ success: false, message:  'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  next();
};

module.exports = { validateRegistration, validateLogin };
