const mongoose= require("mongoose");

const publisherSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: String,
    established: Number, //Not a date since we only have year
    //location: String
    location: {coordinates: {
        type: [Number],
        index: "2dsphere"
    }}
    });

    const reviewSchema= new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        postDate: {
            type: Date,
            "default": Date.Now
        },
        });
            

const gameSchema= mongoose.Schema({
title: {
    type: String,
    required: true
    },
year: Number,
rate: {
    type: Number,
    min: 1,
    max: 5,
    "default": 1
},
price : Number,
minPlayers: {
    type: Number,
    min : 1,
    max: 10
},
maxPlayers: {
    type: Number,
    min : 1,
    max: 10
},
minAge: Number,
designers : [String],
publisher: publisherSchema,
reviews: [reviewSchema]
});
mongoose.model("Game", gameSchema, "games");
