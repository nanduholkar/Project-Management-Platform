import { Router } from "express";
import { registerUser, 
  login,  logoutUser, 
  verifyEmail, refreshAccessToken, 
  forgetPasswordRequest, ResetForgetPassword, 
  getCurrentUser, changeCurrentPassword, 
  resendEmailVerification } from "../controllers/auth.controller.js"
import { validate } from "../middlewares/validators.middleware.js";
import {userRegisterValidator, userLoginValidator,
   userResetForgetPasswordValidator, userChangeCurrentPasswordValidator, 
   userForgetPasswordValidator} from "../validators/index.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"



const router = Router()


// unsecured route
router.route("/register").post(userRegisterValidator() ,validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, login)
router
  .route("/verify-email/:verificationToken")
  .get(verifyEmail) //
router.route("/refresh-token").post(refreshAccessToken)//
router.route("/forget-password").post(userForgetPasswordValidator(), validate, forgetPasswordRequest)
router.route("/reset-password/:resetToken").post(userResetForgetPasswordValidator(), validate, ResetForgetPassword)
  





// secure route
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/Current-user").post(verifyJWT, getCurrentUser)
router.route("/change-password").post(verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword)
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification) //





export default router