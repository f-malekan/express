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

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    isGold: {
        type:Boolean,
        default: false},
    phone:{
        type: String,
        required: true
    }
});

const Customer = mongoose.model('Customer',customerSchema);

app.use(express.json());


app.get('/api/customers',async (req,res)=>{
    const customers = await Customer.find().sort('name');
    res.send(customers)
});

app.get('/api/customers/:id',async(req,res)=>{
    const customer =await Customer.findById(req.params.id)
    if(!customer){res.status(404).send('not found')};
    res.send(customer);
});

app.post('/api/customers',async(req,res)=>{
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

app.put('/api/customers/:id',async (req,res)=>{
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

app.delete('/api/customers/:id',async(req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if(!customer){return res.status(404).send('not found')};

        res.send(customer)
    })



app.listen(3000,()=>console.log('listening to port 3000'))