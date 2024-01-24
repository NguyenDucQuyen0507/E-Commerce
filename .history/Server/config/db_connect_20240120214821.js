// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const uri = `mongodb+srv://nguyenducquyen2k1:gyEpCAoozIPYN4Ih@cluster0.ag8s8xs.mongodb.net/ecommerce?retryWrites=true&w=majority`;
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (conn.connection.readyState === 1) {
      console.log("DB connection successfully");
    } else {
      console.log("Db connect error");
    }
  } catch (error) {
    // console.log("Db connect error ", error);
    console.error("Db connect error", error);
    // throw new Error(error);
  }
};
module.exports = dbConnect;
