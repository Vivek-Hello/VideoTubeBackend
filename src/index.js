// require('dotenv').config({path:'./env'})
import mongoose from "mongoose";
 import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
     path:'./env'
 })


connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`the app is  Runnging at ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongoose Error :",err);
})