const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type: String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password:{
        type: String,
        required:true,
        minlength:5,
        maxlength:1024
    }
})

userSchema.methods.generateToken = function(){
    const token = jwt.sign({_id:this._id}, config.get('jwtPrivateKey'))
    return token;
}
const User = mongoose.model('User',userSchema)

function validateUser(user){

    const schema={
        name:Joi.string().min(5).max(50).required(),
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(1024).required()
    };
    
    return Joi.validate(user,schema);

}
module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.userSchema=userSchema;