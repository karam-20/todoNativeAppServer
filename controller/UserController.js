import { User } from "../models/user.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary"
import fs from "fs"


export const registerController = async(req,res)=>{
    try {

        const {name,email,password} = req.body;
        const avatar = req.files.avatar.tempFilePath;
        

        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"})
        }
        
        const myCloud = await cloudinary.v2.uploader.upload(avatar)

        fs.rmSync("./tmp",{recursive:true}) 

        user = await User.create({name,email,password,avatar:{public_id:myCloud.public_id,url:myCloud.secure_url}})

        sendToken(res,user,201,"User registered successfully")

            
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const loginController = async(req,res)=>{
    try {

        const {email,password} = req.body;

        if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide email and password"})
        }
        

        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"})
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password"})
        }
        
        sendToken(res,user,200,"Logged in successfully")

            
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const logoutController = async(req,res)=>{
    try {

        res.status(200).cookie("token",null,{
            expires:new Date(Date.now())
        }).json({success:true, message:"Logged out successfully"})

             
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}


export const getMyProfileController = async(req,res)=>{
    try {

        const user = await User.findById(req.user._id)

        sendToken(res,user,200,`Welcome back ${user.name}`)   
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const updateProfileController = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id)

        const {name} = req.body;
        const avatar = req.files.avatar.tempFilePath;

        if(name) user.name = name
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
            const myCloud = await cloudinary.v2.uploader.upload(avatar)
            fs.rmSync("./tmp",{recursive:true}) 

            user.avatar = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }
       
        await user.save()

        res.status(200).json({success:true, message:"Profile updated successfully"})  
        
    }
    catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const updatePasswordController = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("+password")
        
        const {oldPassword,newPassword} = req.body;
        
        if(!oldPassword || !newPassword) {
            return res.status(400).json({success:false,message:"Please provide all fields"})
        }
        const isMatch = await user.comparePassword(oldPassword)

        if(!isMatch) {
            return res.status(400).json({message:"Invalid old password", success:false});
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({success:true, message:"Password updated successfully"})  
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}


export const addTaskController = async(req,res)=>{
    try {

       const {title,description} = req.body

       const user = await User.findById(req.user._id)
       

       user.tasks.push({title,description,completed: false,createdAt: new Date(Date.now())})

       await user.save()
       res.status(200).json({success:true, message:"Task added successfully"})

    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const removeTaskController = async(req,res)=>{
    try {

       const {taskId} = req.params

       const user = await User.findById(req.user._id)

      user.tasks = user.tasks.filter(task=>task._id.toString() !== taskId.toString())

       await user.save()
       res.status(200).json({success:true, message:"Task removed successfully"})

    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const updateTaskController = async(req,res)=>{
    try {

       const {taskId} = req.params

       const user = await User.findById(req.user._id)

      user.task = user.tasks.find(task => task._id.toString() === taskId.toString())

      user.task.completed = !user.task.completed

       await user.save()
       res.status(200).json({success:true, message:"Task updated successfully"})

    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}