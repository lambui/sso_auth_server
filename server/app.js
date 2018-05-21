const express = require('express');
const app = express();

//load properties
const properties = require("./properties.json");
const hostname = properties.ip;
const port = properties.port;

//load mock database
const userdb = require("./users.json");

//middlewares
//bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//restAPI
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/users", (req, res) => {
  res.json(userdb);
});

app.post("/users", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

//start server
app.listen(port, hostname, (req, res)=>{
  console.log(`Server running at http://${hostname}:${port}/`);
});

