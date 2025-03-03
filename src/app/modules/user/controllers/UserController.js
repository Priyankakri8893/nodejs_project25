const UserService = require("../services/UserService");
class UserController {
  static async register(req) {
    return await UserService.register(req.body);
  }

  static async verifyOTP(req) {
    return await UserService.verifyOTP(req.body);
  }

  static async login(req) {
    return await UserService.login(req.body);
  }

  static async profile(req) {
    return await UserService.profile(req.user);
  }

  static async editProfile(req) {
    return await UserService.editProfile(req.user, req.body, req.file);
  }
}

module.exports = UserController;
