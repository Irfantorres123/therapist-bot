const app = require("./index.js");
const fs = require("fs");
const https = require("https");
const http = require("http");
const express = require("express");
const { log } = require("./logger/log");

let httpPORT = process.env.PORT | 8080;
let SSLPORT = 8443;
let date = new Date();
try {
  const privateKey = fs.readFileSync("/etc/ssl/private/mytherapysense.pem");
  const certificate = fs.readFileSync("/etc/ssl/certs/mytherapysense.com.crt");
  if (privateKey && certificate) {
    const credentials = {
      key: privateKey,
      cert: certificate,
    };
    https.createServer(credentials, app).listen(SSLPORT, () => {
      log("Enabled SSL");
      log(`Listening on port ${SSLPORT}`);
      log(`Date: ${date}`);
    });
    var httpServer = express();
    httpServer.get("*", function (req, res) {
      res.redirect("https://" + req.headers.host + req.url);
    });
    httpServer.listen(httpPORT);
  }
} catch (err) {
  log("SSL not found, using http alone");
  http.createServer(app).listen(httpPORT, () => {
    log(`Listening on port ${httpPORT}`);
  });
}
