const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { email, firstName, lastName },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message:  'Registration failed',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req. body;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token: 'jwt_token_here', user: { email } },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid credentials',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error. message,
    });
  }
};

module.exports = { register, login, logout };
