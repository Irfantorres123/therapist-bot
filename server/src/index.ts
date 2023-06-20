const bodyParser = require("body-parser");
import express from "express";
require("dotenv").config();

const connect = require("./config/mongodb.config.js");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const path = require("path");
const { initializeAdmin } = require("./config/init.js");
const { log } = require("./logger/log.js");
const winston = require("winston");
import expressWinston from "express-winston";
const { createWriteStream } = require("fs");
const router = require("./routes/index.js");
const adminRouter = require("./routes/admin.js");
const userRouter = require("./routes/users.js");

const application = require("./app.js");
const app = application.express;
let csrfProtection = csurf({ cookie: { key: "x-csrf-token" } });
const CLIENT_BUILD_PATH = path.join(__dirname, "../../client/build");

if (process.env.LOG_PATH)
  app.use(
    expressWinston.logger({
      transports: [
        new winston.transports.Stream({
          stream: createWriteStream(process.env.LOG_PATH, { flags: "a" }),
        }),
      ],
      format: winston.format.combine(winston.format.json()),

      headerBlacklist: ["authorization", "cookie"],
      requestWhitelist: [
        "body.username",
        "body.email",
        "url",
        "method",
        "httpVersion",
        "originalUrl",
        "query",
      ],
    })
  );
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser() as express.RequestHandler);
app.use(csrfProtection as express.RequestHandler);
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next();
  }
);
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }
    next();
  }
);
app.use("/public", express.static(CLIENT_BUILD_PATH));

app.use("/api", router);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

app.get(
  "*",
  function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  }
);

app.use(
  expressWinston.errorLogger({
    transports: [
      process.env.ERROR_PATH
        ? new winston.transports.Stream({
            stream: createWriteStream(process.env.ERROR_PATH, { flags: "a" }),
          })
        : new winston.transports.Console(),
    ],
    format: winston.format.combine(winston.format.json()),
    headerBlacklist: ["authorization", "cookie"],
    requestWhitelist: [
      "body.username",
      "body.email",
      "url",
      "method",
      "httpVersion",
      "originalUrl",
      "query",
    ],
    meta: true,
    dynamicMeta: (req: express.Request, res: express.Response) => req.log,
  })
);
const ErrorRequestHandler = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const stack = err.stack.split("\n");
    log(stack[0], "\n", stack.length > 1 ? stack[1] : "");
    res.status(err.statusCode).json({
      errorName: err.name,
      error: err.message.split(":")[0],
    });
  } catch (e) {
    res.status(500).json({
      errorName: "Internal Server Error",
      error: "Something went wrong",
    });
  }
};
app.use(ErrorRequestHandler as express.ErrorRequestHandler);
connect();
initializeAdmin();
application.startServer();
module.exports = app;
