const mongoose = require('mongoose');
const express = require('express')
const router = express.Router()
const Joi = require('joi');
const {Customer} = require('../models/customers');

router.get('/',async (req,res)=>{
    const customers = await Customer.find().sort('name');
    res.send(customers)
});

router.get('/:id',async(req,res)=>{
    const customer =await Customer.findById(req.params.id)
    if(!customer){res.status(404).send('not found')};
    res.send(customer);
});

router.post('/',async(req,res)=>{
    const schema={
        name:Joi.string().min(5).max(50).required(),
        isGold:Joi.boolean(),
        phone:Joi.string().min(5).max(50).required()
    };
    const result = Joi.validate(req.body,schema);
    if(result.error){
        res.status(400).send("NOT EMPTY")
        return;
    };

    let customer = new Customer({name : req.body.name,isGold: req.body.isGold,phone: req.body.phone});
    customer = await customer.save();
    res.send(customer);
});

router.put('/:id',async (req,res)=>{
    const schema={
        name:Joi.string().min(5).max(50).required(),
        isGold:Joi.boolean(),
        phone:Joi.string().min(5).max(50).required()
    };
    const result = Joi.validate(req.body,schema);
    if(result.error){
        res.status(400).send("NOT EMPTY")
        return;
    };

    
    const customer = await Customer.findByIdAndUpdate(req.params.id,{name : req.body.name,isGold: req.body.isGold,phone: req.body.phone},{new:true})
    if(!customer){
        res.status(404).send('not found')
        return};

        res.send(customer)
});

router.delete('/:id',async(req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if(!customer){return res.status(404).send('not found')};

        res.send(customer)
    })

module.exports = router;