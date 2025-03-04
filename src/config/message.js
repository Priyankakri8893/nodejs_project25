class MessageService {
  constructor() {
    this.messages = {
      success: "Ok",
      invalidPassword: "Password is invalid",
      userNotFound: "User not found",
      password_updated: "Password is successfully updated",
      profile_updated: "Profile is successfully updated",
      loggedIn: "Successfully logIn",
      expireOtp: "Otp is expired",
      incorrectOTP: "Incorrect Otp",
      duplicateEmail: "Email already exists",
      duplicateEmailOrPhone: "User already exists",
      invalidEmail: "Email address is invalid",
      invalidPhone: "Phone number is invalid",
      NotExist: "Do not exist",
      NotCreated: "Do not created, try again",
      notSaved: "Not saved",
      unauthorisedRequest: "Unauthorised request",
      actionForbidden: "This action is forbidden. You don't have permission to do this"
    };

    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target.messages) {
          return target.messages[prop];
        }
        return `Message for ${prop} not found`;
      }
    });
  }
}

const msg = new MessageService();

module.exports = { msg };
