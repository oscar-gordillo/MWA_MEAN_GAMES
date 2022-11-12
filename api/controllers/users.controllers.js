const mongoose = require("mongoose");
const bcrypt=require("bcrypt");

const User = mongoose.model("User");

module.exports.addOne = function (req, res) {
    console.log("login");
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username: usernameme}).exec(function(error,user){
        if (err){
            //error internal server error
            
        }else{
            if (!user) {
                //error finding user status 400 status incorrect username or password don't give too much information
            }else{
                //check password
                /*const passwordMatch=bcrypt.compareSync(password,user.password);
                if (!passwordMatch) {
                    //password incorrect
                }else{
                    //login successful
                }*/
                //async version
                bcrypt.compare(password,user.password,function(err,passwordMatch){
                    if (err){

                    } else{
                        if (!passwordMatch) {
                            //password incorrect
                        }else{
                            //login successful
                            //create JWT token
                        }
                    }
                    //send response
                });
            }
        } 
        //if the status code is differfent to 200 is an error send the response with error
    
    })

}

module.exports.addOne = function (req, res) {
    console.log("users AddOne request");
    /* const salt=bcrypt.genSaltSync(10);
    hash = bcrypt.hashSync(req.body.password,salt); */
    bcrypt.genSalt(10,function(err,saltValue){
        if (err) {

        }else{
            bcrypt.hash(req.body.password,saltValue, function(err,pwdhash){
                if (err) {

                }else{
                    const newUser = {
                        name: req.body.name, username: req.body.username, 
                        password: pwdhash
                    };
                    User.create(newUser, function (err, user) {
                        const response = { status: 201, message: user };
                        if (err) {
                            console.log("Error creating user");
                            response.status = 500;
                            response.message = err;
                        }
                        res.status(response.status).json(response.message);
                    });
                }
            });
        }
    });
     

    
}