const express = require('express');
const app = express();

//load properties
const properties = require("./properties.json");
const hostname = properties.ip;
const port = properties.port;

//start client server
app.listen(port, hostname, (req, res) => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

