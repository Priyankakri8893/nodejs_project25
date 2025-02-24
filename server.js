const express = require("express");
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { env } = require("./src/environment/environment");
const routes = require("./route");
const mongoose = require("./src/app/db/mongoose");
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const server = http.createServer(app);
const path = require("path");
app.use(cors("*"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  try {
    return res.status(200).send("server is running");
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

//Mapping all modules path and path-handler
routes.map((route) => {
  app.use(route.path, route.handler);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`server is running on port ${port}`);
});

module.exports = { server };
