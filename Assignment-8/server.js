const express = require("express");
const app = express();

var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true });
app.use(express.json());

mongoose.connection.on("open", function (err) {
  if (err) {
    console.log("DB error");
    console.log(err);
  } else {
    console.log("connection established");
  }
});
mongoose.connection.on("error", function (err) {
  console.log("DB error");
  console.log(err);
});

const userRouter = require("./routes/user.js");
app.use("/user", userRouter);

app.listen(3001, () => {
  console.log("Server started at port 3001");
});

exports = module.exports = app;
