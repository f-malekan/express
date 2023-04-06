const config = require('config');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const _=require('lodash')
const express = require('express');
const router = express.Router();
const {validateUser,User} = require('../models/users')
const mongoose = require('mongoose');


router.get('/',async(req,res)=>{
    const users =await User.find()
    res.send(users)
});

router.get('/:id', async(req,res)=>{
    const user =await User.findById(req.params.id);
    if(!user){return res.status(404).send("not found")}
    res.send(user)
});

router.post('/',async(req,res)=>{
    const {error} = validateUser(req.body)
    if(error){return res.status(400).send('joi validation error')}

    let user = await User.findOne({email:req.body.email})
    if(user){return res.status(400).send('already registered')}

    user = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    const salt =await bcrypt.genSalt(10);
    user.password =await bcrypt.hash(user.password,salt)
    user = await user.save()

    const token = user.generateToken()
    res.send(token)
    res.header('x-auth-token',token).send(_.pick(user,['name','email']))
})

router.put('/:id', async(req,res)=>{
    const {error} = validateUser(req.body)
    if(error){return res.status(400).send('joi validation error')}

    const user =await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    },{new:true})
    if(!user){return res.status(404).send("not found")}
    res.send(user)
})

router.delete('/:id',async(req,res)=>{
    const user = await User.findByIdAndRemove(req.params.id)
    if(!user){return res.status(404).send("not found")}
    res.send(user)

})

module.exports = router;