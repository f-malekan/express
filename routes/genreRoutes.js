const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const {Genre}=require("../models/genres")


router.get('/',async (req,res)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres)
});

router.get('/:id',async(req,res)=>{
    const genre =await Genre.findById(req.params.id)
    if(!genre){res.status(404).send('not found')};
    res.send(genre);
});

router.post('/',async(req,res)=>{
    const schema={
        name:Joi.string().min(5).required()
    };
    const result = Joi.validate(req.body,schema);
    if(result.error){
        res.status(400).send("NOT EMPTY")
        return;
    };

    let genre = new Genre({name : req.body.name});
    genre = await genre.save();
    res.send(genre);
});

router.put('/:id',async (req,res)=>{
    const schema={
        name:Joi.string().min(3).required()
    };
    const result = Joi.validate(req.body,schema);
    if(result.error){
        res.status(400).send("NOT EMPTY")
        return;
    };

    
    const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true})
    if(!genre){
        res.status(404).send('not found')
        return};

        // genre.name=req.body.name
        res.send(genre)
});

router.delete('/:id',async(req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre){return res.status(404).send('not found')};

        res.send(genre)
    })

module.exports = router