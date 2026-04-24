import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendEmail, emailVerificationMailGenContent } from "../utils/mail.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { forgetPasswordMailGenContent } from "../utils/mail.js";

const generateAccessTokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Check existing user
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with email or username already exists"
    );
  }

  // Create user
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  // Generate token
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  // Send email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailGenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
    ),
  });

  // Remove sensitive data
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering a user"
    );
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: createdUser },
      "User registered successfully. Verification email sent."
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const {email, password, username} = req.body

  if(!username && !email){
    throw new ApiError(400, "Username or email is required")

  }
  const user = await User.findOne({
    $or: [{email}, {username}]
  })

  if(!user){
    throw new ApiError(400, "User does not exist")
  }
  const ispasswordValid = await user.isPasswordCorrect(password)

  if(!ispasswordValid){
    throw new ApiError(400, "Invalid credentials")
  }
  const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)
  
    // Remove sensitive data
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const options = {
    httpOnly : true,
    secure : true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {user : loggedInUser,
          accessToken,
          refreshToken
        },
        "User logged in successfully"
      )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset : {
        refreshToken: 1,
      },
      
    },
    {
      new: true,
    }
  )

  const options ={
    httpOnly : true,
    secure :true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User logged out")
    )
})

const getCurrentUser = asyncHandler(async (req, res) =>{
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched Successfully"));
  
})

const verifyEmail = asyncHandler(async (req, res) =>{
  const {verificationToken} = req.params

  if (!verificationToken){
    throw new ApiError(400, "Email vefification token is missing")

  }

  let hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest("hex")

  const user = await User.findOne({
    emailVerificationToken : hashedToken,
    emailVerificationExpiry : {$gt : Date.now()}
  })

  if (!user){
    throw new ApiError(400, "Email verification token is missing")
  }
  
  user.emailVerificationToken = undefined
  user.emailVerificationExpiry = undefined

  user.isEmailVerified = true 
  await user.save({validateBeforeSave : false})

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          isEmailVerified : true
        },
        "Email is verified"
      )
    )
})

const resendEmailVerification = asyncHandler(async (req, res) =>{
  const user = await User.findById(req.user?._id)

  if(!user){
    throw new ApiError(404, "User Does not exist")
  }

  if(user.isEmailVerified){
    throw new ApiError(409, "Email is already Verified")

  }

  const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();
  
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
  
    await user.save({ validateBeforeSave: false });
  
    await sendEmail({
      email: user?.email,
      subject: "Please verify your email",
      mailgenContent: emailVerificationMailGenContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
      ),
    });
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Mail has been sent to your email ID"));
  
})

const refreshAccessToken= asyncHandler(async (req, res) =>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorised access")
  }

  try{
    const decodedToken =  jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)

    if(!user){
      throw new ApiError(401, "Invalid refresh Token")
    }

    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Invalid Refresh Token")
    }

    const options = {
      httpOnly : true, 
      secure : true
    }

    const {accessToken, refreshToken : newRefreshToken} = await generateAccessTokenAndRefreshTokens(user._id)
    user.refreshToken = newRefreshToken
    await user.save()

    return res 
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access token refreshd"
        )
      )


  }catch(error){
    throw new ApiError(401, "Invalid refresh token")
  }
})


const forgetPasswordRequest = asyncHandler(async (req, res) =>{
  const {email} = req.body

  if(!email){
    throw new ApiError(404, "Email is required")
  }

  const user = await User.findOne({email})

  if(!user){
    throw new ApiError(404, "User does not exist", [])
  }

  const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

  user.forgotPasswordToken = hashedToken
  user.forgotPasswordExpiry = tokenExpiry

  console.log("UNHASHED TOKEN:", unHashedToken); //add
console.log("HASHED TOKEN (saved in DB):", hashedToken); // add

  

  await user.save({validateBeforeSave : false})

  await user.save({ validateBeforeSave: false })

// ✅ ADD HERE
console.log("DB CHECK:", await User.findOne({ email: user.email })) // add

  await sendEmail({
      email: user?.email,
      subject: "Reset your password",
      mailgenContent: forgetPasswordMailGenContent(
        user.username,
        `${process.env.FORGET_PASSWORD_REDIRICT_URL}/${unHashedToken}`,
      ),
    })
    
  
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Password reset email has been sent to your email address"
        )
      )
})

const ResetForgetPassword = asyncHandler(async (req, res) =>{
  const {resetToken} = req.params
  const {newPassword}  = req.body

  if (!newPassword) {
    throw new ApiError(400, "New password is required");
  }

  console.log("TOKEN FROM URL:", resetToken);  // add

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")

  console.log("HASHED FROM URL:", hashedToken); // add

    const user = await User.findOne({
      forgotPasswordToken : hashedToken,
      forgotPasswordExpiry : {$gt : new Date()}
    })

  console.log("USER FOUND:", user);

    if(!user){
      throw new ApiError(409, "Token is invalid or expired")
    }

    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res  
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset Successful"))

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id)

  if(!user){
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordValid){
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
    .status(200)
    .json(
      new ApiResponse(200,
        {},
        "Password changed successfully"
      )
    )
})


export { registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgetPasswordRequest,
  ResetForgetPassword,
  changeCurrentPassword



   
};