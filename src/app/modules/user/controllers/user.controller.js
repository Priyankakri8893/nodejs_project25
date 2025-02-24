const {
  register,
  verifyOTP,
  login,
  profile,
  editProfile,
} = require("../bussiness/user.bussiness");

exports.register = async (req) => await register(req.body);
exports.verifyOTP = async (req) => await verifyOTP(req.body);
exports.login = async (req) => await login(req.body);
exports.profile = async (req) => await profile(req.user);
exports.editProfile = async (req) => await editProfile(req.user, req.body, req.file);

