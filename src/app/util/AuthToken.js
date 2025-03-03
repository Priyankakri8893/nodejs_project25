const jwt = require("jsonwebtoken");

class AuthToken {
  constructor(user) {
    this.user = user;
  }

  generate() {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign(
          { _id: this.user._id.toString(), roleId: this.user.roleId },
          process.env.secret_token
        );
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = AuthToken;
