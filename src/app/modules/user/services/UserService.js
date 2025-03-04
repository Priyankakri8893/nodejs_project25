const { UserModel } = require("../models/UserModel");
const { msg } = require("../../../../config/message");
const AuthToken = require("../../../util/AuthToken");
const Validator = require("../../../middleware/Validator");
const EmailService = require("../../../util/EmailService");
const validator = require("validator");

class UserService {
  constructor() {
    this.UserModel = new UserModel();
    this.EmailService = new EmailService();
  }

  async register(body) {
    if (!validator.isEmail(body.email)) throw msg.invalidEmail;
    if (!Validator.isValid(body.password)) throw "password is required";

    UserModel.validatePassword(body.password);

    const foundUser = await this.UserModel.findOne({ email: body.email, isVerified: true });
    if (foundUser) throw msg.duplicateEmail;

    if (Validator.isValid(body.roleId) && body.roleId == 1) body.role = "teacher";

    let OTP = Math.floor(1000 + Math.random() * 999).toString();
    let ciphertext = UserModel.encryptOTP(OTP);

    body.password = UserModel.encryptPassword(body.password);
    this.EmailService.emailOtp(body.email, `Please enter this OTP ${OTP}. This code is valid for 10 minutes`, OTP);

    let newDate = new Date();
    body.otp = ciphertext;
    body.otpDate = newDate;

    await this.UserModel.findOneAndUpdate({ email: body.email }, { $set: body }, { upsert: true });

    return {
      msg: "user created successfully",
    };
  }

  async verifyOTP(body) {
    const { email, otp } = body;

    if (!Validator.isValid(email)) throw "email is required";
    if (!Validator.isValid(otp)) throw "Please provide otp";

    let foundUser = await this.UserModel.findOne({ email: email, isDeleted: false });
    if (!foundUser) throw msg.userNotFound;

    let date1 = foundUser.otpDate;
    let date1Time = date1.getTime();
    let date2 = new Date();
    let date2Time = date2.getTime();
    let minutes = (date2Time - date1Time) / (1000 * 60);
    if (minutes > 10) {
      throw msg.expireOtp;
    }

    const originalText = UserModel.decryptOTP(foundUser.otp);
    if (originalText == otp) {
      foundUser.isVerified = true;
      foundUser.isEmailVerified = true;
      await foundUser.save();

      return {
        msg: "OTP verified successfully",
      };
    } else {
      throw msg.incorrectOTP;
    }
  }

  async login(body) {
    const { email, password } = body;

    if (!Validator.isValid(email)) throw "Email is required";
    if (!Validator.isValid(password)) throw "password is required";

    let foundUser = await this.UserModel.findOne({ email: email, isDeleted: false });
    if (!foundUser) throw msg.userNotFound;

    const originalText = UserModel.decryptPassword(foundUser.password);
    if (originalText == password) {
      return {
        msg: msg.loggedIn,
        role: foundUser.role,
        roleId: foundUser.roleId,
        token: await new AuthToken(foundUser).generate(),
      };
    } else {
      throw msg.invalidPassword;
    }
  }

  async profile(user) {
    const foundUser = await this.UserModel.findById(user._id);
    if (!foundUser) throw msg.userNotFound;
    return {
      msg: msg.success,
      data: foundUser,
    };
  }

  async editProfile(user, body, file) {
    if (Validator.isValid(body.email)) {
      if (!validator.isEmail(body.email)) throw msg.invalidEmail;
      const foundUser = await this.UserModel.findOne({ email: body.email, _id: { $ne: user._id } });
      if (foundUser) throw msg.duplicateEmail;

      let OTP = Math.floor(1000 + Math.random() * 999).toString();
      let ciphertext = UserModel.encryptOTP(OTP);

      this.EmailService.emailOtp(body.email, `Please enter this OTP ${OTP}. This code is valid for 10 minutes`, OTP);

      let newDate = new Date();
      body.otp = ciphertext;
      body.otpDate = newDate;
      body.isEmailVerified = false;
    }

    if (Validator.isValid(body.password)) {
      UserModel.validatePassword(body.password);
      body.password = UserModel.encryptPassword(body.password);
    }

    if (Validator.isValid(body.roleId) || Validator.isValid(body.role)) throw 'role cannot be changed itself';

    if (file) {
      body.profile = `/public/${file.filename}`;
    }

    const foundUser = await this.UserModel.findByIdAndUpdate({ _id: user._id }, { $set: body }, { new: true });

    return {
      msg: msg.profile_updated,
    };
  }
}

module.exports = new UserService();
