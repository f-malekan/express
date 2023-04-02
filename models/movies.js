const mongoose = require('mongoose');

const {genreSchema,Genre}= require('../models/genres');



const movieSchema =new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStock:{
        type:Number,
        required: true,
        min:0,
        max:255
    },
    dailyRentalRate:{
        type:Number,
        required: true,
        min:0,
        max:255  
    }
})

const Movie = mongoose.model('Movie',movieSchema)


module.exports.movieSchema = movieSchema
module.exports.Movie = Movie


