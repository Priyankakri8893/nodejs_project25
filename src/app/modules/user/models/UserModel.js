const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

class UserModel {
  constructor() {
    this.UserSchema = new mongoose.Schema(
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true, unique: true, lowercase: true },
        profile: { type: String, trim: true },
        password: { type: String, trim: true },
        roleId: { type: Number, default: 0 }, // 0 for user and 1 for teacher
        role: { type: String, enum: ["teacher", "user"], default: "user" },
        otp: { type: String, required: true, trim: true },
        otpDate: { type: Date, required: true },
        isVerified: { type: Boolean, default: false },
        isEmailVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
      },
      { timestamps: true }
    );

    this.User = mongoose.model("User", this.UserSchema);
  }

  static validatePassword(password) {
    const check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!check.test(password)) {
      throw "Password must be at least 6 characters long, include one letter, one number, and one special character.";
    }
  }

  async save(user) {
    const newUser = new this.User(user);
    return await newUser.save();
  }

  async findOne(query) {
    return await this.User.findOne(query);
  }

  async findById(id) {
    return await this.User.findById(id);
  }

  async findByIdAndUpdate(query, update, options) {
    return await this.User.findByIdAndUpdate(query, update, options);
  }

  async findOneAndUpdate(query, update, options) {
    return await this.User.findOneAndUpdate(query, update, options);
  }

  static decryptPassword(encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      process.env.crypto_secret_key
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, process.env.crypto_secret_key).toString();
  }

  static encryptOTP(otp) {
    return CryptoJS.AES.encrypt(otp, process.env.crypto_secret_key).toString();
  }

  static decryptOTP(encryptedOtp) {
    const bytes = CryptoJS.AES.decrypt(encryptedOtp, process.env.crypto_secret_key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}

module.exports = { UserModel };
