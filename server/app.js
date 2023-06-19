var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");

const CLIENT_BUILD_PATH = path.join(__dirname, "../client/build");
var app = express();
app.use(
  app.get("NODE_ENV") === "production" ? logger("production") : logger("dev")
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(CLIENT_BUILD_PATH));

app.use("/users", usersRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("NODE_ENV") === "production" ? {} : err;

  // render the error page
  res.status(err.status || 500);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

module.exports = app;
