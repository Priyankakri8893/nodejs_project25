const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { env } = require("../../environment/environment");
const mongoose = require("../db/mongoose");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);
  }

  configureMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors("*"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use("/public", express.static(path.join(__dirname, "../../../public")));
  }

  setupRoot() {
    this.app.get("/", (req, res) => {
      try {
        return res.status(200).send("server is running");
      } catch (error) {
        return res.status(500).send(error.message);
      }
    });
  }

  start() {
    this.server.listen(this.port, "0.0.0.0", () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

module.exports = Server;
