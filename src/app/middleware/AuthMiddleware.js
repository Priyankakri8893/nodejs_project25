const { msg } = require("../../config/message");
const { errorHandler } = require("../helpers/errorHandling.helper");
const jwt = require("jsonwebtoken");
const secret = process.env.secret_token;
class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const auth = req.header("Authorization");
      if (!auth) throw msg.unauthorisedRequest;

      const token = auth.substr(auth.indexOf(" ") + 1);
      let decoded = jwt.verify(token, secret);

      decoded.id = decoded._id;
      req.user = decoded;
      return next();
    } catch (err) {
      const error = errorHandler(err, 401);
      return res.status(error.status).send(error);
    }
  }

  static async roleAuth(req, res, next) {
    try {
      if (req.user.roleId !== 1) throw msg.actionForbidden;
      return next();
    } catch (err) {
      const error = errorHandler(err, 401);
      return res.status(error.status).send(error);
    }
  }
}

module.exports = AuthMiddleware;
