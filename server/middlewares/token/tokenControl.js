const jwt = require("jsonwebtoken");
const errorHandlerWrapper = require("express-async-handler");
const {
  isTokenIncluded,
  getTokenFromCookie,
} = require("../../helpers/auth/tokenH");
const CustomError = require("../../helpers/error/CustomError");
const User = require("../../model/User");

const {
  generateSubscriptionLimit,
} = require("../../helpers/model/modelHelper");

// == == == == == == == == == == == == == == == == == == == ==
//  TOKEN CONTROL IF IT SENDED
// == == == == == == == == == == == == == == == == == == == ==

const tokenControl = () =>
  errorHandlerWrapper((req, res, next) => {
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

    if (!isTokenIncluded(req)) {
      return next(
        new CustomError("You are not authorized, Please login an account", 401)
      );
    }

    const token = getTokenFromCookie(req);

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) next(new CustomError("Your Authorize is invalid", 401));
      req.user = {
        uid: decoded.uid,
        ob: decoded.ob,
        scope: decoded.scope,
        iat: decoded.iat,
        exp: decoded.exp,
        aud: decoded.aud,
        role: decoded.role,
        device_id: decoded.device_id,
        stg: decoded.stg,
        cd: decoded.cd,
        unt: decoded.unt,
      };

      return next();
    });
  });

// == == == == == == == == == == == == == == == == == == == ==
//  VERIFIED CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const verifiedControl = () =>
  errorHandlerWrapper(async (req, res, next) => {
    if (req.user.userObject.cd == USER_CREATED)
      return next(new CustomError("Please verify your account"));

    return next();
  });

// == == == == == == == == == == == == == == == == == == == ==
//  USER ACCESS CODE CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const accessCodeControl = (access_codes) =>
  errorHandlerWrapper(async (req, res, next) => {
    const now = Date.now();
    let user = req.user.userObject;
    let accessCodes = user.accessCodes;

    let result = false;

    for (let i = 0; i < user.accessCodes.length; i++) {
      const accessCode = user.accessCodes[i];

      if (accessCode.expireAt <= now) accessCodes.splice(i, 1);
      else {
        if (access_codes.includes(accessCode.access_code)) result = true;
      }
    }

    if (user.accessCodes.length > accessCodes.length) {
      user.accessCodes = accessCodes;
      user = generateSubscriptionLimit(user);
      await user.save();
    }

    if (result) return next();
    else return next(new CustomError("You are not allowed", 403));
  });

// == == == == == == == == == == == == == == == == == == == ==
//  BLOCKED CONTROL
// == == == == == == == == == == == == == == == == == == == ==

const blockedControl = () =>
  errorHandlerWrapper(async (req, res, next) => {
    if (!req.user.uid) return next(new CustomError("Please provide an id"));

    const objectModel = await User.findById(req.user.uid).select("-__v");

    if (!objectModel)
      return next(
        new CustomError(
          "Authorization is unsuccessful, Please control your validations",
          400
        )
      );

    if (objectModel.blocked)
      return next(
        new CustomError("This user has been banned for any reason", 403)
      );

    req.user.userObject = objectModel;

    return next();
  });
module.exports = {
  tokenControl,
  verifiedControl,
  accessCodeControl,
  blockedControl,
};
