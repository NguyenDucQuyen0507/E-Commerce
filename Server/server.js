const express = require("express");
const cors = require("cors");
var cookieParser = require("cookie-parser");
require("dotenv").config();
const dbConnect = require("./config/db_connect");
const app = express();
const initRouter = require("./routers");
//dọc được các data có kiểu  URL-encoded (name=John&age=30&email=john@example.com)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
const port = process.env.PORT || 8888;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRouter(app);
app.listen(port, () => {
  console.log("Server listening on port", port);
});
