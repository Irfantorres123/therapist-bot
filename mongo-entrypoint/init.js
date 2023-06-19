var db = connect(
  `mongodb://root:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/admin`
);

db = db.getSiblingDB("therapist"); // we can not use "use" statement here to switch db

db.createUser({
  user: "irfan",
  pwd: "38588a61be6857203996fda8a158bbae",
  roles: [{ role: "root", db: "admin" }],
  passwordDigestor: "server",
});
