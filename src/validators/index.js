import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is Invalid"),
        body("username").trim().notEmpty().withMessage("username is requied").isLowercase().withMessage("UserName must be in lower case").isLength({min: 3}).withMessage("Username must be at leaset 3 char"),
        body("password").trim().notEmpty().withMessage("Password is required "),
        body("fullName").optional().trim()
    ]
}