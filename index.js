const express = require('express')
const app = express()
const path=require("path")
const port = 3000

app.use(function(req,res,next){
    console.log(req.method,req.url);
    next();
})

app.use(express.static(path.join(__dirname,"public")))

const server=app.listen(port, () => {
    console.log('Example app listening on port '+server.address().port)
  })

