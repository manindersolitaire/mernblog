import { User } from "../models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async(req,res)=>{
    try {
        const {firstName, lastName, email , password} = req.body
        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({
                success : false,
                message : 'All fields are required'
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success : false,
                message : 'Invalid Email'
            })
        }
        if(password.length < 6){
            return res.status(400).json({
                success : false,
                message : 'Password must be atleast 6 characters'
            })
        }

        const existingEmail = await User.findOne({email:email})
        if(existingEmail){
            return res.status(400).json({
                success: false,
                message : 'Email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword
        })

        return res.status(201).json({
            success : true,
            message :  "Account created successfully"
        })
    } catch (error) {
        console.log('Error in register controller', error)
        return res.status(500).json({
            success : false,
            message : "failed to register"
        })
    }
}

export const login = async(req,res)=>{
    try {
        const {email , password} =  req.body
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : 'All fields are required'
            })
        }
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success : false,
                message : 'Incorrect email or password'
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(400).json({
                success : false,
                message : 'Invalid Credentials'
            })
        }

        const token =  await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn : '1d'})

        return res.status(200).cookie("token", token, {maxAge : 1*24*60*60*1000, httpsOnly : true , sameSite: "strict"}).json({
            success : true,
            message : `Welcome back ${user.firstName}, ${token}`,
            user
        })

    } catch (error) {
        console.log('Error in login controller', error)
        return res.status(500).json({
            success : false,
            message : "failed to login"
        })
    }
}

export const logout = async(req,res)=>{
    try {
        return res.status(200).cookie("token", "", {maxAge : 0}).json({
            message : "Logged out successfully",
            success : true
        })        
    } catch (error) {
        console.log(error)
    }
}


