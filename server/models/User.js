class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.role = data.role;
    this.createdAt = data.createdAt;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

const UserModel = {
  async findById(id) {
    console.log('Finding user by ID:', id);
    return null;
  },

  async findByEmail(email) {
    console.log('Finding user by email:', email);
    return null;
  },

  async create(userData) {
    console.log('Creating user:', userData);
    return null;
  },

  async update(id, userData) {
    console.log('Updating user:', id, userData);
    return null;
  },

  async delete(id) {
    console.log('Deleting user:', id);
    return null;
  },
};

module.exports = { User, UserModel };
