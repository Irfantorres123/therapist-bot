const mongoose = require("mongoose");
async function performTransaction(transaction) {
  await mongoose.startSession().then(async (session) => {
    session.startTransaction();
    await transaction();
    await session.commitTransaction();
    session.endSession();
  });
}
module.exports = { performTransaction };
