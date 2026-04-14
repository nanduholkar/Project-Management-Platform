import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

let myusername = process.env.user_name

console.log("value", myusername);


console.log("Start of the backend Project");
