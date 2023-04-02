const express = require('express')
const mongoose = require('mongoose')
const Joi = require('joi')
const router = express.Router()
const {Movie}= require('../models/movies')
const {Customer}= require('../models/customers')
const {Rental}= require('../models/rentals')

router.get('/',async(req,res)=>{
    const rentals = await Rental.find()
    res.send(rentals)
});

router.get('/:id',async(req,res)=>{
  const rental = await Rental.findById(req.params.id)
  if(!rental){res.status(404).send('not found')}
  res.send(rental)
})

router.post('/',async(req,res)=>{
    const {error} = validateRental(req.body)
    if(error) return res.status(400).send('Joyvalidation error')

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) return res.status(404).send('movie not found')

    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(404).send('customer not found')

    if(movie.numberInStock==0){return res.status(400).send("not available")}

    movie.numberInStock--
    movie.save()

    let rental = new Rental({
     customer :{
        _id:customer._id,
        name:customer.name,
        isGold:customer.isGold,
        phone:customer.phone
     },
     movie : {
        _id:movie._id,
        genre:movie.genre,
        title:movie.title,
        numberInStock:movie.numberInStock,
        dailyRentalRate:movie.dailyRentalRate
     }
    })
    
    rental = await rental.save()
    res.send(rental);
})

router.put('/:id',async(req,res)=>{
    let rental = await Rental.findById(req.params.id)
    if(!rental){res.status(404).send('not found')}

    const movie = await Movie.findById(req.body.movieId)
    if(!movie) return res.status(404).send('movie not found')

    const customer = await Customer.findById(req.body.customerId)
    if(!customer) return res.status(404).send('customer not found')

    let newrental = rental.update({_id : req.params.id},{
        $set:{
            customer : {
                _id:customer._id,
                name:customer.name,
                isGold:customer.isGold,
                phone:customer.phone
            },
            movie:{
                _id:movie._id,
                title:movie.title,
                numberInStock:movie.numberInStock,
                dailyRentalRate:movie.dailyRentalRate
            }
        }
    })
    newrental.send()
  })


  router.delete('/:id',async(req,res)=>{
    const rental = Rental.findByIdandremove(req.params.id)
    if(!rental){return res.status(404).send('not found')}

    res.send(rental)
  })

  function validateRental(rental){

    const schema={
        customerId:Joi.string().required(),
        movieId:Joi.string().required()
    };
    
    return Joi.validate(rental,schema);

}

module.exports = router;