const mongoose = require('mongoose')

const {movieSchema, Movie}= require('../models/movies')
const {customerSchema, Customer}= require('../models/customers')


const rentalSchema = new mongoose.Schema({
    customer:{
        type: customerSchema,
        required: true
    },
    movie:{
        type: movieSchema,
        required:true
    }
    // ,
    // dateOut:{
    //     type: Date,
    //     required: true,
    //     default:Date.now
    // },
    // dateReturned:{
    //     type: Date,
    // },
    // retalFee:{
    //     type:Number,
    //     min:0
    // }
})

const Rental = mongoose.model('Rental',rentalSchema);

 module.exports.rentalSchema = rentalSchema;
 module.exports.Rental= Rental;