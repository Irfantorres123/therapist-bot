const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { log } = require("../logger/log.js");

async function connect(path) {
  dotenv.config({ path: path });
  const { TEST } = process.env;
  if (TEST) {
    const mongoServer = await MongoMemoryServer.create();
    let connection = await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      useCreateIndex: true,
    });
    return connection.connection;
  }
  // mongodb environment variables

  const { MONGO_DB, MONGO_PORT, MONGO_USER, MONGO_PASSWORD } = process.env;
  let { MONGO_HOSTNAME } = process.env;
  if (process.env.PRODUCTION === undefined) {
    MONGO_HOSTNAME = process.env.LOCAL_ADDRESS;
  }
  // mongoose options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true,
    authSource: "therapist",
  };
  const dbConnectionURL = {
    LOCAL_DB_URL: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`,
    REMOTE_DB_URL: process.env.MONGODB_URI,
  };
  try {
    let connection = await mongoose.connect(
      dbConnectionURL.LOCAL_DB_URL,
      options
    );
    return connection.connection;
  } catch (err) {
    log(err);
    process.exit(1);
  }
}
module.exports = connect;
