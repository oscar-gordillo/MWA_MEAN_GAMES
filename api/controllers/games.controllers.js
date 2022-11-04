const gamesData= require("../data/games.json");
const dbConnection= require("../data/dbconnection");
const ObjectId= require("mongodb").ObjectId;

module.exports.getAll= function(req, res) {

    const db= dbConnection.get();

    const gameCollection= db.collection("games");
    let offset= 0;
    let count= 5;
    if (req.query && req.query.offset) {
    offset= parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
    count= parseInt(req.query.count, 10);
    }
    gameCollection.find().skip(offset).limit(count).toArray(function(err,games) {
        console.log("Found games", games);
        res.status(200).json(games);
    });

    
};

module.exports.getOne= function(req, res) {
    const db= dbConnection.get();
    const gamesCollection= db.collection("games");
    const gameId= req.params.gameId;
    gamesCollection.findOne({_id : ObjectId(gameId)}, function(err,game) {
        console.log("Found game", game);
        res.status(200).json(game);
        });
    }

    module.exports.addOne= function(req, res) {
        const db= dbConnection.get();
        const gamesCollection= db.collection("games");
        let newGame= {};
        if (req.body && req.body.title&& req.body.price) {
            newGame.title= req.body.title;
            newGame.price= parseFloat(req.body.price);
            gamesCollection.insertOne(newGame, function(err, response) {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    console.log(response);
                    res.status(201).json(response);
                }
        });

    }
}        
    