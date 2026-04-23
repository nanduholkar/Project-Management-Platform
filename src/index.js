import dotenv from "dotenv"

dotenv.config({
    path: "./.env" 
})


import app from "./app.js"
import connectDB from "./db/index.js"
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);



// const express = require('express')---we have imported it so no use case

// const app = express()
const port = process.env.PORT || 3000;


connectDB()
  .then(() =>{
    app.listen(port, () =>{
      console.log(`Example app listening on  http://localhost:${port}`)
    })
  })
  .catch((err) =>{
    console.error("MongoDB connection error",err)
    process.exit()
    
  })