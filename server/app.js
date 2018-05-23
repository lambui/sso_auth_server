const fs = require('fs'); //package to read file on file system (fs)
const https = require('https');
const crypto = require('crypto');

//load express
const express = require('express');
const app = express();

//load properties
const properties = require("./properties.json");
const hostname = properties.ip;
const port = properties.port;

//load mock database
const userdb = require("./users.json");

//middlewares
//Helmet: force HTTP request into HTTPS request (HSTS)
const helmet = require('helmet');
app.use(helmet());

//bodyParser: read json from request body
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
//load private key and cert
//const symmetric_key = crypto.createDiffieHellman(2048).generateKeys(); //create symetric key for key exchange encryption on server starts
const https_options = 
{
  key: fs.readFileSync('cert/key.pem'),
  cert: fs.readFileSync('cert/cert.pem'),
  //dhparam: symmetric_key, 
  dhparam: fs.readFileSync('cert/symmetric_key.pem')
};
https.createServer(https_options, app).listen(port, hostname, (req, res) => {
  console.log(`Server starts on https://${hostname}:${port}`);
});

