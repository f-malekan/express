const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const app = express();

mongoose.connect('mongodb://127.0.0.1/vidly',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>console.log('connected to mongodb...'))
    .catch(err=>console.error('could not connect to mongodb...',err))

const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre',genreSchema);

app.use(express.json());


app.get('/api/genres',async (req,res)=>{
    const genres = await Genre.find().sort('name');
    res.send(genres)
});

app.get('/api/genres/:id',async(req,res)=>{
    const genre =await Genre.findById(req.params.id)
    if(!genre){res.status(404).send('not found')};
    res.send(genre);
});

app.post('/api/genres',async(req,res)=>{
    const schema={
        name:Joi.string().min(3).required()
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

app.put('/api/genres/:id',async (req,res)=>{
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

app.delete('/api/genres/:id',async(req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre){return res.status(404).send('not found')};

        res.send(genre)
    })



app.listen(3000,()=>console.log('listening to port 3000'))