import { text } from "express";
import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async(options) =>{
    const mailGenerator = new Mailgen({
        theme : "default",
        product: {
            name: "Task Manager",
            link:"https://taskmanagelink.com"
        }
    })
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: Number(process.env.MAILTRAP_SMTP_PORT),
        auth:{
            user : process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })
    const mail = {
        from : 'mail.taskmanager@example.com',
        to: options.email,
        subject:options.subject,
        text : emailTextual,
        html: emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email Services failed silently. Make sure that you have provided your MAILTRIP CREDENTIALS in .env file")
        console.error("Error: ",error)
    } 
}


const emailVerificationMailGenContent = (username, verificationUrl) => {
    return{
        body:{
            name: username,
            intro : "welcome to our App! We're excited to have you on board.",
            action:{
                instructions : "To verify your email please click on the following button",
                button:{
                    color :'rgb(21, 21, 149)',
                    text: "verify your email", 
                    link: verificationUrl
                }
            },
            outro : "Need help, or have questions? Just Reply to this email, we would love to help "
        }
    }
}

const forgetPasswordMailGenContent = (username, passwordResetUrl) => {
    return{
        body:{
            name: username,
            intro : "we got a request to reset the password of your account",
            action:{
                instructions : "To reset your password Click on the following button",
                button:{
                    color :'rgb(21, 21, 149)',
                    text: "Reset Password", 
                    link: passwordResetUrl
                }
            },
            outro : "Need help, or have questions? Just Reply to this email, we would love to help "
        }
    }
}

export{emailVerificationMailGenContent,
    forgetPasswordMailGenContent , sendEmail
}