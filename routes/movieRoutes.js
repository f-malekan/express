const mongoose = require('mongoose');
const express = require('express');
const router = express();
const Joi = require('joi');
const {genreSchema,Genre}= require('../models/genres');
const {movieSchema,Movie}= require('../models/movies');


router.get('/',async(req,res)=>{
    const movies =await Movie.find()
    res.send(movies);
});

router.get('/:id',async(req,res)=>{
    const movie =await  Movie.findById(req.params.id)
    if(!movie) return res.status(404).send('not found')
    res.send(movie)
})

router.post('/',async(req,res)=>{
    const {error} = validateMovie(req.body)
    if(error) return res.status(400).send('Joyvalidation error')

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('genre not found')

    let movie = new Movie({
        title:req.body.title,
        genre: {
            _id:genre._id,
            name:genre.name
        },
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate
    })
    movie = await movie.save()
    res.send(movie);
})

router.put('/:id',async(req,res)=>{
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send('genre not found')

    const movie = await Movie.updateOne({_id:req.params.id},{
        $set:{
            'title':req.body.title,
            'genre': {
                _id:genre._id,
                name:genre.name
            },
            'numberInStock':req.body.numberInStock,
            'dailyRentalRate':req.body.dailyRentalRate
        }
    })

        res.send(movie)
})

router.delete('/:id',async(req,res)=>{
    const movie =await Movie.findByIdAndRemove(req.params.id)
    if(!movie) return res.status(404).send('not found')
    res.send(movie)
})

function validateMovie(movie){

    const schema={
        title:Joi.string().min(5).max(255).required(),
        genreId:Joi.string().required(),
        numberInStock:Joi.number().min(0).max(255).required(),
        dailyRentalRate:Joi.number().min(0).max(255).required()
    };
    
    return Joi.validate(movie,schema);

}

module.exports=router