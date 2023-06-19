const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

function generateJwt(payload) {
  let token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
  return token;
}

async function verifyToken(token) {
  let googleUser = false;
  let decodedToken = jwt.decode(token);
  if (decodedToken.iss == "https://accounts.google.com") googleUser = true;
  if (googleUser) return await verify(token);
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
  });
}
module.exports = { generateJwt, verifyToken };
