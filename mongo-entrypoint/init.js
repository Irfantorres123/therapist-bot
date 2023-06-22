var db = connect(
  `mongodb://root:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/admin`
);

db = db.getSiblingDB("therapist"); // we can not use "use" statement here to switch db

db.createUser({
  user: process.env.MONGO_NEW_USERNAME,
  pwd: process.env.MONGO_NEW_PASSWORD,
  roles: [{ role: "root", db: "admin" }],
  passwordDigestor: "server",
});
