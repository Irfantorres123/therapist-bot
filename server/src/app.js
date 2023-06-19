const express = require("express");
const { log } = require("./logger/log.js");
const fs = require("fs");
const https = require("https");
const http = require("http");
class App {
  constructor() {
    this.express = express();
    this.credentials = this.fetchCredentials();
    this.httpPORT = process.env.PORT | 8080;
    this.SSLPORT = 8443;
    this.httpsServer = null;
    this.httpServer = null;
    if (this.credentials) {
      this.httpsServer = https.createServer(this.credentials, this.express);
    } else {
      this.httpServer = http.createServer(this.express);
    }
  }
  startServer() {
    if (this.credentials) {
      this.startSSLServer();
    } else {
      this.startHTTPServer();
    }
  }
  startSSLServer() {
    if (!this.credentials) return;
    const date = new Date();
    this.httpsServer.listen(this.SSLPORT, () => {
      log("Enabled SSL");
      log(`Listening on port ${this.SSLPORT}`);
    });
    const redirectionServer = express();
    redirectionServer.get("*", (req, res) => {
      log("Redirecting to SSL");
      res.redirect("https://" + req.headers.host + req.url);
    });
    redirectionServer.listen(this.httpPORT, () => {
      log(`Redirection server listening on port ${this.httpPORT}`);
    });
    log(`Date: ${date}`);
  }

  startHTTPServer() {
    if (this.credentials) return;
    const date = new Date();
    this.httpServer.listen(this.httpPORT, () => {
      log("Disabled SSL");
      log(`Listening on port ${this.httpPORT}`);
    });
    log(`Date: ${date}`);
  }

  fetchCredentials() {
    if (
      !fs.existsSync("/etc/ssl/private/thesanad_com.pem") ||
      !fs.existsSync("/etc/ssl/certs/thesanad.com.crt")
    ) {
      return false;
    }
    const privateKey = fs.readFileSync("/etc/ssl/private/thesanad_com.pem");
    const certificate = fs.readFileSync("/etc/ssl/certs/thesanad.com.crt");
    return { key: privateKey, cert: certificate };
  }
}

module.exports = new App();
