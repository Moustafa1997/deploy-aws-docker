const express = require("express");
const app = express();
const mongoose = require("mongoose");
const redis = require("redis");
const os = require("os");
var bodyParser = require("body-parser"); //pull information from HTML forms
// var path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3001;
//connect to redis
const Redis_PORT = 6379;
const Redis_HOST = "redis";

const redisClient = redis.createClient({
  url: `redis://${Redis_HOST}:${Redis_PORT}`,
  legacyMode: true,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("ready", () => console.log("Redis Client Ready"));
redisClient.connect();

// Connect to the database
const user_name = "root",
  password = "example",
  BB_Port = 27017;

const url = `mongodb://${user_name}:${password}@mongo:${BB_Port}/`;
mongoose
  .connect(url)
  .then((v) => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.log("failed to connect", e);
  });

app.get("/", async (req, res) => {
  await redisClient.set("books", "Hello from redis! ");
  console.log(os.hostname());
  res.send("<h1> hello from docker with watch tower 💖</h1>");
});
app.get("/data", async (req, res) => {
  await redisClient.get("books", (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
    res.send(`<h1>${data}</h1>`);
  });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
