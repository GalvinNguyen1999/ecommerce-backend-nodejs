const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("combined"));
app.use(helmet());
// app.use(compression());

// init db

// innit route
app.get("/", (req, res) => {
  const strCompress = 'Cuong dev'
  return res.status(200).json({ message: "Hello World", metadata: strCompress.repeat(100000) });
});

// handling error

module.exports = app;
