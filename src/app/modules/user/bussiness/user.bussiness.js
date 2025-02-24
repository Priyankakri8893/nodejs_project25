const { msg } = require("../../../../config/message");
const { generateAuthToken } = require("../../../util/generate.token");
const { isValid } = require("../../../middleware/validator.middleware");

const { User } = require("../models/user.model");
const CryptoJS = require("crypto-js");
const { emailOtp } = require("../../../util/emailOtp")

let validator = require("validator");

const register = async (body) => {
  if (!validator.isEmail(body.email)) throw msg.invalidEmail
  if (!isValid(body.password)) throw "password is required";

  let check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  if (!check.test(body.password)) {
    throw "Password must be at least 6 characters long, include one letter, one number, and one special character.";
  }

  const foundUser = await User.findOne({ email: body.email, isVerified: true });
  if (foundUser) throw msg.duplicateEmail;
  if (isValid(body.roleId) && body.roleId == 1) body.role = "teacher";

  let OTP = Math.floor(1000 + Math.random() * 999).toString();
  let ciphertext = CryptoJS.AES.encrypt(
    OTP,
    process.env.crypto_secret_key
  ).toString();

  body.password = CryptoJS.AES.encrypt(
    body.password,
    process.env.crypto_secret_key
  ).toString();

  emailOtp(
    body.email,
    `Please enter this OTP ${OTP} . This code is valid for 10 minutes`,
    OTP
  );

  let newDate = new Date();
  body.otp = ciphertext;
  body.otpDate = newDate;

  const createuser = await User.findOneAndUpdate(
    { email: body.email },
    { $set: body },
    { new: true, upsert: true }
  );

  return {
    msg: "user created successfully",
  };
};

const verifyOTP = async (body) => {
  const { email, otp } = body;

  if (!isValid(email)) throw "email is required";
  if (!isValid(otp)) throw "Please provide otp";

  let foundUser = await User.findOne({ email: email, isDeleted: false });
  if (!foundUser) throw msg.userNotFound;

  let date1 = foundUser.otpDate;
  let date1Time = date1.getTime();
  let date2 = new Date();
  let date2Time = date2.getTime();
  let minutes = (date2Time - date1Time) / (1000 * 60);
  if (minutes > 10) {
    throw msg.expireOtp;
  }

  const bytes = CryptoJS.AES.decrypt(
    foundUser.otp,
    process.env.crypto_secret_key
  );
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText == otp) {
    foundUser.isVerified = true;
    foundUser.isEmailVerified = true;
    res = await foundUser.save();

    return {
      msg: "OTP verified successfully",
    };
  } else {
    throw msg.incorrectOTP;
  }
};

const login = async (body) => {
  const { email, password } = body;

  if (!isValid(email)) throw "Email is required";
  if (!isValid(password)) throw "password is required";

  let foundUser = await User.findOne({
    email: email,
    isDeleted: false,
  });
  if (!foundUser) throw msg.userNotFound;

  const bytes = CryptoJS.AES.decrypt(
    foundUser.password,
    process.env.crypto_secret_key
  );
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if (originalText == password) {
    return {
      msg: msg.loggedIn,
      role: foundUser.role,
      roleId: foundUser.roleId,
      token: await generateAuthToken(foundUser),
    };
  } else {
    throw msg.invalidPassword;
  }
};

const profile = async (user) => {
  const foundUser = await User.findById(user._id);
  if (!foundUser) throw msg.userNotFound;
  return {
    msg: msg.success,
    data: foundUser,
  };
}

const editProfile = async (user, body, file) => {
  if (isValid(body.email)) {
    if (!validator.isEmail(body.email)) throw msg.invalidEmail
    const foundUser = await User.findOne({ email: body.email, _id: { $ne: user._id } });
    if (foundUser) throw msg.duplicateEmail;
    let OTP = Math.floor(1000 + Math.random() * 999).toString();
    let ciphertext = CryptoJS.AES.encrypt(
      OTP,
      process.env.crypto_secret_key
    ).toString();

    emailOtp(
      body.email,
      `Please enter this OTP ${OTP} . This code is valid for 10 minutes`,
      OTP
    );
    let newDate = new Date();
    body.otp = ciphertext;
    body.otpDate = newDate;
    body.isEmailVerified = false
  }

  if (isValid(body.password)) {
    let check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!check.test(body.password)) {
      throw "Password must be at least 6 characters long, include one letter, one number, and one special character.";
    }
    body.password = CryptoJS.AES.encrypt(
      body.password,
      process.env.crypto_secret_key
    ).toString();
  }

  if (isValid(body.roleId) || isValid(body.role)) throw 'role cannot be changed itself'

  if (file) {
    body.profile = `/public/${file.filename}`;
  }

  const foundUser = await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: body },
    { new: true }
  );

  return {
    msg: msg.profile_updated,
  };
};


module.exports = {
  register,
  verifyOTP,
  login,
  profile,
  editProfile,
};
