const gamesData= require("../data/games.json");
const dbConnection= require("../data/dbconnection");
const ObjectId= require("mongodb").ObjectId;

module.exports.getAll= function(req, res) {

    const db= dbConnection.get();

    const gameCollection= db.collection("games");
    let offset= 0;
    let count= 4;
    if (req.query && req.query.offset) {
        offset= parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count= parseInt(req.query.count, 10);
        if (count>7) {
            count=7;
        }
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

    module.exports.deleteOne= function(req, res) {
        const db= dbConnection.get();
        const gamesCollection= db.collection("games");
        const gameId= req.params.gameId;
        gamesCollection.deleteOne({_id : ObjectId(gameId)}, function(err,deletedCount) {
            console.log("deleted game", deletedCount);
            res.status(200).json(deletedCount);
            });
        }

    module.exports.addOne= function(req, res) {
        const db= dbConnection.get();
        const gamesCollection= db.collection("games");
        let newGame= {};
        if (req.body && req.body.title&& req.body.price) {
            newGame.title= req.body.title;
            newGame.price= parseFloat(req.body.price);
            let minPlayers=req.body.minPlayers;
            let minAge= req.body.minAge;
            newGame.minPlayers=minPlayers;
            newGame.minAge=minAge;
            if (minPlayers<1 || minPlayers > 11) {
                res.status(400).send('min players must be between 1 and 11');
                return;
            }
            if (minAge<6 || minAge > 99) {
                res.status(400).send('min age must be between 6 and 99');
                return;
            }
            gamesCollection.insertOne(newGame, function(err, insertedId) {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    console.log(response);
                    res.status(201).json(insertedId);
                }
        });

    }else{
        res.status(400).send('title and price are required');
        return;
    }
}        
    