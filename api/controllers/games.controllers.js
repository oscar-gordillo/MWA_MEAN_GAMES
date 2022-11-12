//const gamesData= require("../data/games.json");
//const dbConnection = require("../data/dbconnection");
const mongoose = require("mongoose");
//const ObjectId = require("mongodb").ObjectId;

const Game = mongoose.model(process.env.GAME_MODEL);

function _runGeoQuery(req,res, offset,count){
    const lng=parseFloat(req.query.lng);
    const lat=parseFloat(req.query.lat);
    const point= {type:"Point",coordinates: [lng,lat]}; //Stores lng then lat

    let minDistance=0;
    if (req.query.minDistance) {
        minDistance=req.query.minDistance;
    }
    let maxDistance=10000;
    if (req.query.maxDistance) {
        maxDistance=req.query.maxDistance;
    }

    const query = {"publisher.location.coordinates":{
        $near: {
            $geometry: point,
            $maxDistance: maxDistance,
            $minDistance: minDistance
        }
    }};
    Game.find(query).skip(offset).limit(count).exec(function (err, games) {
        if (err) {
            console.log("Error finding games");
            res.status(500).json(err);
        } else {
            console.log("Found games", games.length);
            res.status(200).json(games);
        }
    });
}

module.exports.getAll = function (req, res) {

    //const db= dbConnection.get();

    //const gameCollection= db.collection("games");
    let offset = parseFloat(process.env.DEFAULT_FIND_OFFSET, 10);
    let count = parseFloat(process.env.DEFAULT_FIND_COUNT, 10);
    const maxCount = parseInt(process.env.DEFAULT_MAX_FIND_LIMIT, 10);


    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    if (isNaN(offset) || isNaN(count)) {
        res.status(400).json({ "message": "QueryString Offset and Count should be numbers" });
        return;
    }
    if (count > maxCount) {
        res.status(400).json({ "message": "Cannot exceed count of " + maxCount });
        return;
    }
    /*gameCollection.find().skip(offset).limit(count).toArray(function(err,games) {
        console.log("Found games", games);
        res.status(200).json(games);
    });*/

    let query={}//another way

    if(req.query && req.query.lat && req.query.lng){
        //_runGeoQuery(req,res, offset,count); //buildquery here
        console.log('geosearch');

        const lng=parseFloat(req.query.lng);
        const lat=parseFloat(req.query.lat);
        const point= {type:"Point",coordinates: [lng,lat]}; //Stores lng then lat

        let minDistance=0;
        if (req.query.minDistance) {
            minDistance=req.query.minDistance;
        }
        let maxDistance=1000000;
        if (req.query.maxDistance) {
            maxDistance=req.query.maxDistance;
        }

        query = {"publisher.location.coordinates":{
                $near: {
                    $geometry: point,
                    $maxDistance: maxDistance,
                    $minDistance: minDistance
                }
            }
        };

//return ; // comment this out
        
    }

    console.log(query);

    Game.find(query).skip(offset).limit(count).exec(function (err, games) {
        if (err) {
            console.log("Error finding games");
            res.status(500).json(err);
        } else {
            console.log("Found games", games.length);
            res.status(200).json(games);
        }
    });


};

module.exports.getOne = function (req, res) {
    const gameId = req.params.gameId;
    Game.findById(gameId).exec(function (err, game) {
        const response = {
            status: 200,
            message: game
        };
        if (err) {
            console.log("Error finding game");
            response.status = 500;
            response.message = err;
        } else if (!game) {
            console.log("Game id not found");
            response.status = 404;
            response.message = { "message": "Game ID not found" };
        }
        res.status(response.status).json(response.message);
    });
}

module.exports.deleteOne = function (req, res) {
    const gameId = req.params.gameId;
    Game.findByIdAndDelete(gameId).exec(function(err,deletedGame){
        const response = {
            status: 200,
            message: deletedGame
        };
        if (err) {
            console.log("Error deleting game");
            response.status = 500;
            response.message = err;
        } else if (!deletedGame) {
            console.log("Game id not found");
            response.status = 404;
            response.message = { "message": "Game ID not found" };
        }
        res.status(response.status).json(response.message);
    });    
}

module.exports.addOne = function (req, res) {
    console.log("Game AddOne request");
    const newGame = {
        title: req.body.title, year: req.body.year, rate: req.body.rate, price: req.body.price,
        minPlayers: req.body.minPlayers, maxPlayers: req.body.maxPlayers,
        publisher: req.body.publisher, reviews: [], minAge: req.body.minAge,
        designers: req.body.designers
    };
    Game.create(newGame, function (err, game) {
        const response = { status: 201, message: game };
        if (err) {
            console.log("Error creating game");
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    });
}
