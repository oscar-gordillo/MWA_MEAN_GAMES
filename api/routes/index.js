const express= require("express");
const router= express.Router();
const gamesController= require("../controllers/games.controllers");

router.route("/games").get(gamesController.getAll).post(gamesController.addOne);

router.route("/games/:gameId").get(gamesController.getOne);

router.route("/json")
.get(function(req, res) {
console.log("GET JSON request received");
res.status(200).json({"JSON_Data": "GET"});
})
.post(function(req, res) {
console.log("POST JSON request");
res.status(200).json({"JSON_Data": "POST"});
});
module.exports = router;