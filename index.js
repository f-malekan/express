const mongoose = require('mongoose');
const express = require('express')
const app=express()
const customerRoutes=require('./routes/customerRoutes')
const genreRoutes=require('./routes/genreRoutes')
const movieRoutes=require('./routes/movieRoutes')
const rentalRoutes=require('./routes/rentalRoutes')


app.use(express.json())
app.use("/api/customers",customerRoutes)  
app.use("/api/genres",genreRoutes)
app.use("/api/movies",movieRoutes)
app.use("/api/rentals",rentalRoutes)


mongoose.connect('mongodb://127.0.0.1/vidly',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>console.log('connected to mongodb...'))
    .catch(err=>console.error('could not connect to mongodb...',err))


app.listen(3000,()=>console.log('listening to port 3000'))