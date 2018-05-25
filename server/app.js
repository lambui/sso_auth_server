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
var userdb = require("./users.json");
var tokendb = require("./tokens.json");

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

app.post("/login", (req, res) => {
  let body = req.body;
  for (let i in userdb.users) //for loop searching for user in userdb should be a query if using a real database
  {
    let user = userdb.users[i];
    if(user.username === body.username && user.password === body.password)
    {
      //generate random hash as session token
      let current_date = (new Date()).valueOf().toString();
      let random = Math.random().toString();
      let token = crypto.createHash('sha1').update(current_date + random).digest('hex');

      //store session_token in tokens.json
      let login_session = {};
      login_session.username = body.username;
      login_session.token = token;
      tokendb.tokens.push(login_session);
      fs.writeFile("./tokens.json", JSON.stringify(tokendb), (err)=>{if(err!=null){console.log(err)}});
      tokendb = require("./tokens.json");

      //send success response
      res.status(200).send("Successfully login! Session token: " + token);
      return;
    }
  }
  //send fail response
  res.status(401).send("Wrong username or password!");
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

