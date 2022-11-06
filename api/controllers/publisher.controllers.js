const mongoose = require("mongoose");
const Game = mongoose.model(process.env.GAME_MODEL);
const _addPublisher = function (req, res, game) {
    game.publisher.name = req.body.name;
    game.publisher.country = req.body.country;
    game.publisher.established = req.body.established;
    game.publisher.location.coordinates = [parseFloat(req.body.lng),
    parseFloat(req.body.lat)];
    game.save(function (err, updatedGame) {
        const response = { status: 200, message: [] };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = updatedGame.publisher;
        }
        res.status(response.status).json(response.message);
    });
}

const getOne = function (req, res) {
    console.log("GET One Publisher Controller");
    const gameId = req.params.gameId;
    Game.findById(gameId).select("publisher").exec(function (err, game) {
        console.log("Found publisher ", game.publisher, " for Game ", game);
        res.status(200).json(game.publisher);
    });
}
const addOne = function (req, res) {
    console.log("Add One Publisher Controller");
    const gameId = req.params.gameId;
    Game.findById(gameId).select("publisher").exec(function (err, game) {
        console.log("Found game ", game);
        const response = { status: 200, message: game };
        if (err) {
            console.log("Error finding game");
            response.status = 500;
            response.message = err;
        } else if (!game) {
            console.log("Error finding game");
            response.status = 404;
            response.message = { "message": "Game ID not found " + gameId };
        }
        if (game) {
            _addPublisher(req, res, game);
        } else {
            res.status(response.status).json(response.message);
        }
    });
}
module.exports = {
    getOne: getOne,
    addOne: addOne
}