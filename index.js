const config = require('config')
const mongoose = require('mongoose');
const express = require('express')
const app=express()
const customerRoutes=require('./routes/customerRoutes')
const genreRoutes=require('./routes/genreRoutes')
const movieRoutes=require('./routes/movieRoutes')
const rentalRoutes=require('./routes/rentalRoutes')
const userRoutes=require('./routes/userRoutes')
const auth=require('./routes/auth')

if(!config.get('jwtPrivateKey')){
    console.log('jwtPrivateKey is not set.')
    process.exit(1)
}

app.use(express.json())
app.use("/api/customers",customerRoutes)  
app.use("/api/genres",genreRoutes)
app.use("/api/movies",movieRoutes)
app.use("/api/rentals",rentalRoutes)
app.use("/api/users",userRoutes)
app.use("/api/auth",auth)

mongoose.connect('mongodb://127.0.0.1/vidly',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(()=>console.log('connected to mongodb...'))
    .catch(err=>console.error('could not connect to mongodb...',err))


app.listen(3000,()=>console.log('listening to port 3000'))