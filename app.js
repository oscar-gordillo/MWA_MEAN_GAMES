const express = require('express')
const app = express()
require("dotenv").config();
//require("./api/data/dbconnection.js").open();
require("./api/data/db.js");
const path=require("path")

const routes= require("./api/routes");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
    console.log(req.method,req.url);
    next();
})

app.use("/api",function(req,res,next){
    res.header('Access-Control-Allow-Origin','http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,DELETE,PUT,PATCH');

    next();
})

app.use("/api", routes);

app.use(express.static(path.join(__dirname,"public")));



   

const server=app.listen(process.env.PORT, () => {
    console.log('Example app listening on port '+server.address().port)
  })

