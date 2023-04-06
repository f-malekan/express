const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const Joi = require('joi')
const {User,userSchema}= require('../models/users')

router.post('/',async(req,res)=>{
    const {error} = validate(req.body)
    if(error){return res.status(400).send('invalid username or password')}

    let user = await User.findOne({email:req.body.email})
    if(!user){return res.status(400).send('invalid username or password')}

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if(!validPassword){return res.status(400).send('invalid username or password')}

    const token = user.generateToken()
    res.send(token)
})


function validate(user){

    const schema={
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(1024).required()
    };
    
    return Joi.validate(user,schema);

}

module.exports = router;