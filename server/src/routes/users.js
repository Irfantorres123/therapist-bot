var express = require("express");
const { verifyGoogleUser } = require("../middleware/authenticator");
const { createUser, existsUser } = require("../users/methods");
const {
  validateEmailAndPassword,
  validateCredentials,
} = require("../validators/middleware");
const createError = require("http-errors");
const { generateJwt } = require("../cryptography/jwt");

var router = express.Router();

router.post("/createGoogleUser", verifyGoogleUser, async (req, res, next) => {
  try {
    const payload = req.payload;
    const email = payload.email;
    const name = payload.name;
    await createUser({ name, email, googleUser: true });
    res.json({ success: true });
  } catch (err) {
    next(createError(500, `Error while registering: ${err.message}`));
  }
});

router.post("/register", validateEmailAndPassword, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await existsUser(email)) {
      next(createError(400, "User already exists"));
      return;
    }
    const user = await createUser({ name, email, password });
    let jwt = generateJwt({
      name: user.name,
      email: user.email,
      isAdmin: false,
    });
    res.json({ token: jwt });
  } catch (err) {
    next(createError(500, `Error while registering: ${err.message}`));
  }
});

router.post("/login", validateCredentials, async (req, res, next) => {
  try {
    const user = req.user;
    let jwt = generateJwt({
      name: user.name,
      email: user.email,
      isAdmin: false,
    });
    res.json({ token: jwt });
  } catch (err) {
    next(createError(500, `Error while logging in: ${err.message}`));
  }
});

module.exports = router;
