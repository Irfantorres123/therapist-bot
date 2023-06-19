const User = require("../models/user.js");
const createError = require("http-errors");
const { verifyToken } = require("../cryptography/jwt.js");
async function authenticate(req, res, next) {
  try {
    let authorization = req.headers.authorization;
    if (authorization === undefined) {
      next(createError(401, "No token provided"));
      return;
    }
    let parts = authorization.split(" ");
    if (parts[0] !== "Bearer" || parts.length !== 2) {
      next(createError(401, "Invalid token"));
      return;
    }
    let token = parts[1];
    let user = await validateAndFetchUser(token);
    if (!user) {
      next(createError(401, "Invalid token"));
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    next(createError(500, `Error while authenticating: ${error.message}`));
    return;
  }
}

async function validateAndFetchUser(token) {
  let payload = await verifyToken(token);
  let { email } = payload;
  return await User.findOne({ email: email })
    .select("-password -__v -salt")
    .exec();
}

async function verifyGoogleUser(req, res, next) {
  let authorization = req.headers.authorization;
  if (authorization === undefined) {
    next(createError(401, "No token provided"));
    return;
  }
  let parts = authorization.split(" ");
  if (parts[0] !== "Bearer" || parts.length !== 2) {
    next(createError(401, "Invalid token"));
    return;
  }
  let token = parts[1];
  let payload = await verifyToken(token, true);
  req.payload = payload;
  next();
}

function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    next(createError(401, "You are not an admin"));
  }
}

module.exports = {
  authenticate,
  isAdmin,
  validateAndFetchUser,
  verifyGoogleUser,
};
