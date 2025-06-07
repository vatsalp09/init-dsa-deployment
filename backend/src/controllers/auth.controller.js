import bycrypt from "bcryptjs";
import {db} from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res)=>{
    const {email, password, name} = req.body;
    try { 
        const existinguser = await db.user.findUnique({
            where:{
                email
            }
        })
        if(existinguser){
            return res.status(400).json({
                error:"User alreay exists"
            })
        }
        
        const hashedPassword = await bycrypt.hash(password,10);
        
        const newUser = await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role:UserRole.USER
            }
        })

        const token = jwt.sign({id:newUser.id}, process.env.JWT_SECRET, {expiresIn:"7d"})
        
        res.cookie("jwt", token, {
            httpOnly:true,
            sameSite:"none",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000*60*60*24*7
        })

        res.status(201).json({
            success:true,
            message:"User created successfully",
            user:{
                id:newUser.id,
                email:newUser.email,
                name:newUser.name,
                role:newUser.role,
                image:newUser.image
            }
        })
    } catch (error) {
        console.log("Error while creating user: ",error);
        res.status(500).json({
            success:false,
            error:"Error while creating user"
        })
    }
}

export const login = async (req, res)=>{
    const {email, password} = req.body;

    try {
        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user){
            return res.status(401).json({
                error:"User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                error:"Invalid credentials"
            })
        }

        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn:"7d"})

        res.cookie("jwt", token, {
            httpOnly:true,
            sameSite:"none",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000*60*60*24*7
        })

        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user:{
                id:user.id,
                email:user.email,
                name:user.name,
                role:user.role,
                image:user.image
            }
        })
    } catch (error) {
        console.log("Error while user login : ",error);
        res.status(500).json({
            success:false,
            error:"Error in user login"
        })
    }
}

export const logout = async (req, res)=>{
    try {
        res.clearCookie("jwt",{
            httpOnly:true,
            sameSite:"none",
            secure:process.env.NODE_ENV !== "development"
        })

        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    } catch (error) {
        console.error("Error while user logging out: ",error);
        res.status(500).json({
            error:"Error while user logging out"
        })
    }
}

export const check = async (req, res)=>{
    try {
        res.status(200).json({
            success:true,
            message:"User authenticated successfully",
            user:req.user
        })
    } catch (error) {
        console.error("Error checking user: ",error)
        res.status(500).json({
            success:false,
            message:"Error creating user"
        })
    }
}