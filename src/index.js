import dotenv from "dotenv"
import app from "./app.js"

dotenv.config({
    path: "./.env"
})

// const express = require('express')---we have imported it so no use case

// const app = express()
const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
