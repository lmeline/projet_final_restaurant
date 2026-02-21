const bcrypt = require("bcrypt");

class PasswordHasher {
    // Method to hash a password
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }
    // Method to compare a plaintext password with a hash
    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = PasswordHasher;