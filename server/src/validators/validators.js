function validEmail(email) {
  var re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

function validPassword(password) {
  return String(password).length >= 8;
}
module.exports = { validEmail, validPassword };
