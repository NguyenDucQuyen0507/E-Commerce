const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    if (conn.connection.readyState === 1) {
      console.log("DB connection successfully");
    } else {
      console.log("Db connect error");
    }
  } catch (error) {
    console.log("Db connect error ", error);
    throw new Error(error);
  }
};
module.exports = dbConnect;
