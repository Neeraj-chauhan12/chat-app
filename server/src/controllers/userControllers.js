import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const existUser=await User.findOne({email});
        if(existUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({username,email,password:hashedPassword});
        await newUser.save();
        res.status(201).json({message:"User registered successfully",user:newUser});

    }catch(error){
        
        res.status(500).json({message:"Internal Server register Error"});
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',})
        await user.save();
        res.status(200).json({message:"Login successful",user,token});

    } catch (error) {
         console.log("Error in registering user",error);
        res.status(500).json({message:"Internal Server login Error"});
        
    }
}

export const logoutUser=async(req,res)=>{
    try {
        
        res.clearCookie('token');
        res.status(200).json({message:"Logout successful"});
    } catch (error) {
         console.log("Error in registering user",error);
        res.status(500).json({message:"Internal Server logout Error"});
        
        
    }
}

export const getUserProfile=async(req,res)=>{
    try {

        const userId=req.userId;
        const user=await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"User profile fetched successfully",user});
        
    } catch (error) {
         console.log("Error in registering user",error);
        res.status(500).json({message:"Internal Server logout Error"});
        
        
    }
}

export const getAllUsers=async(req,res)=>{
    const userId=req.userId;
    try {
        const users=await User.find({_id:{$ne:userId}}).select('-password');
        res.status(200).json({message:"All users fetched successfully",users});
    } catch (error) {
        console.log("Error in registering user",error);
        res.status(500).json({message:"Internal Server logout Error"});
        
        
    }
}