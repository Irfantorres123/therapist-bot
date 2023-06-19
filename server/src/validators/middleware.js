const { verifyPassword } = require("../cryptography/pass");
const User = require("../models/user");
const createError = require("http-errors");
const { validEmail, validPassword } = require("./validators");
async function verifyUserExists(req, res, next) {
  try {
    let email = req.email;
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      next(createError(400, "User with the same Email ID exists already"));
    }
    next();
  } catch (error) {
    next(
      createError(500, `Error while verifying if user exists: ${error.message}`)
    );
  }
}
async function validateCredentials(req, res, next) {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        error: "INVALID_CREDENTIALS",
        message: "Email and password are required",
      });
      next();
      return;
    }

    let user = await User.findOne({ email, isGoogleAccount: false }).exec();
    if (user === null) {
      next(createError(401, "Invalid email or password"));
      return;
    }
    let verified = verifyPassword(password, user.password, user.salt);
    if (!verified) {
      next(createError(401, "Invalid email or password"));
      return;
    }
    req["user"] = user;
    next();
  } catch (error) {
    next(createError(500, error.message));
  }
}
function validateEmailAndPassword(req, res, next) {
  let { name, email, password } = req.body;
  if (!email || !password) {
    next(createError(400, "Email and password are required"));
    return;
  }
  if (!validEmail(email)) {
    next(createError(400, "Invalid email"));
    return;
  }
  if (!validPassword(password)) {
    next(createError(400, "Password must be at least 8 characters in length"));
    return;
  }
  if (name.length > 40) {
    next(createError(400, "Name must be less than 40 characters"));
    return;
  }
  if (/[\[\(\}\)]/.test(name)) {
    next(createError(400, "Name cannot contain brackets"));
    return;
  }
  next();
}

module.exports = {
  verifyUserExists,
  validateEmailAndPassword,
  validateCredentials,
};
