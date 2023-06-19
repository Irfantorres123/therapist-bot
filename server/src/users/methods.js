const { generateSalt, generateHash } = require("../cryptography/pass");
const User = require("../models/user");
async function existsUser(email) {
  let user = await User.findOne({ email: email }).exec();
  return user ? true : false;
}
async function findUser(email) {
  let user = await User.findOne({ email: email }).exec();
  return user;
}
async function createUser({ name, email, googleUser, password }) {
  if (await existsUser(email)) return await findUser(email);
  if (googleUser) return await createGoogleUser({ name, email });

  return await createLocalUser({ name, email, password });
}

async function createGoogleUser({ name, email }) {
  return await User.create({
    name,
    email,
    isGoogleAccount: true,
  });
}

async function createLocalUser({ name, email, password }) {
  let salt = generateSalt();
  let object = {
    name: name,
    email: email,
    password: generateHash(password, salt),
    salt: salt,
  };
  if (await existsUser(email)) {
    throw createError(400, "User already exists");
  }
  let user = await User.create(object);
  return user;
}

module.exports = { createUser, existsUser };
