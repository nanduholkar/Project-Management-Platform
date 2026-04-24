import {User } from "../models/user.models.js"
import {ApiError} from "../utils/api-error.js"
import { asyncHandler} from "../utils/async-handler.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next) =>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    console.log("RAW HEADER:", req.header("Authorization"))
    console.log("TOKEN:", token)

    if(!token){
        throw new ApiError(401, "Unauthorised request")

    }

    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User
          .findById(decodedToken?._id)
          .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
        
        if(!user){
        throw new ApiError(401, "Invalid Access Token")

        }  
        req.user = user
        next()
        console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET)
    }catch(error){
        throw new ApiError(401, "Invalid access token")

    }
    
})

