const mongoose = require("mongoose");
const Game = mongoose.model(process.env.GAME_MODEL);
const getAll = function (req, res) {
    console.log("GET Reviews Controller");
    const gameId = req.params.gameId;
    Game.findById(gameId).select("reviews").exec(function (err, game) {
        console.log("Found reviews ", game.reviews, " for Game ", game);
        res.status(200).json(game.reviews);
    });
}
const getOne = function (req, res) {
    console.log("GET One Review Controller");
    const gameId = req.params.gameId;
    const reviewId = req.params.reviewId;
    Game.findById(gameId).select("reviews").exec(function (err, game) {
        console.log("Found review ", game.reviews.id(reviewId), " for Game ", game);
        res.status(200).json(game.reviews.id(reviewId));
    });
}
module.exports = {
    getAll: getAll,
    getOne: getOne
}
