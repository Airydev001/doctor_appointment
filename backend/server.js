
import express from 'express'

// const cors = require('./node_modules/cors')
import cors from 'cors'
// const connectDB = require('./config/mongodb')
import connectDB from './config/mongodb.js'
import 'dotenv/config'
//const dotenv =require('dotenv/config')
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

//api endpoint
app.use('/api/admin', adminRouter)

//localhost:4400/api/admin/add-doctor
app.get("/ ", (req,res)=>{
res.status(200).send({
"message":"App connected to the port 4000"
})
})

app.listen(port,(req,res)=>{
console.log("it was connected");
})