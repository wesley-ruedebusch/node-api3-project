const express = require("express");
const helmet = require("helmet");

const userRouter = require("./users/userRouter.js");
const postRouter = require("./posts/postRouter.js");

const server = express();

server.use(helmet());
server.use(express.json());

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", logger, userRouter);
server.use("/api/posts", logger, postRouter);

//custom middleware
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`
  );
  next();
}

module.exports = server;