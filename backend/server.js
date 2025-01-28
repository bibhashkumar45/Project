import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import conectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// app config 
const app=express();
const port=process.env.PORT|| 4000;
conectDB();
connectCloudinary();
// middlewares
app.use(express.json())
app.use(cors());


// api endpoint
app.get('/', (req,res)=>
{
  res.send("API WORKING WELL");
})


// Start the Server
app.listen(port, ()=>console.log("Server Started",port));
