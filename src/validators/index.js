import { body} from "express-validator";
import {AvailableUserRole} from "../utils/constants.js"


const userRegisterValidator = () => {
    return [
        body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is Invalid"),
        body("username").trim().notEmpty().withMessage("username is requied").isLowercase().withMessage("UserName must be in lower case").isLength({min: 3}).withMessage("Username must be at leaset 3 char"),
        body("password").trim().notEmpty().withMessage("Password is required "),
        body("fullName").optional().trim()
    ]
}



const userLoginValidator = () =>{
    return[
        body('email')
          .optional()
          .isEmail()
          .withMessage("Email is Invalid"),
        body("username")
          .optional()
          .isLength({ min : 3})
          .withMessage("username must be at least 3 chars"),
        body("password")
          .notEmpty()
          .withMessage("Password is requied")
          
    ]
}

const userChangeCurrentPasswordValidator = () => {
  return[
    body("oldPassword").notEmpty().withMessage("old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required")
  ]
}

const userForgetPasswordValidator = () =>{
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is Invalid")
  ]
}

const userResetForgetPasswordValidator = () =>{
  return [
    body("newPassword")
      .notEmpty()
      .withMessage("Password is required")
    

  ]
}

const createProjectValidator = () =>{
  return[ 
    body("name")
      .trim()
      .notEmpty()
      .withMessage('Name is required'),
    body("description")
      .optional()
      .trim()

  ]
}

const addMembertoProjectValidator = () =>{
  return[
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("role")
      .notEmpty()
      .withMessage("role is required")
      .isIn(AvailableUserRole)
      .withMessage("Role is invalid")
      
  ]
}


export { 
  userRegisterValidator, 
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userResetForgetPasswordValidator,
  userForgetPasswordValidator,
  createProjectValidator,
  addMembertoProjectValidator



}
