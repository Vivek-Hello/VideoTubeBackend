import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.models.js";

import { ApiResponces } from "../utils/ApiResponces.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req ,res)=>{
     const {fullName,email,userName,password } =req.body
   
    if (fullName === ""){
      throw  new ApiError(400 , "fullNmme is required")
    }
    if (email === ""){
        throw  new ApiError(400 , "email is required")
      }
    if (userName === ""){
        throw  new ApiError(400 , "username is required")
      }
    if (password === ""){
        throw  new ApiError(400 , "password is required")
      }


 
    const existedUser=User.findOne({
        $or:[{userName},{email}]
    })

    if (existedUser) {
        throw new ApiError(409,"User already exist")
    }
    
    console.log(req.files);
   
    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0].path

    if(!avatarLocalPath){
      throw new ApiError(400,"the avatar is nessary")
    }
  
   const avatar=await  uploadOnCloudinary(avatarLocalPath)
   const coverImag=await uploadOnCloudinary(coverImageLocalPath)
   
   if(!avatar){
    throw new ApiError(400,"avatar file is nessary")

   }
  const user =await User.create({
    fullName,
    avatar:avatar.url,
    coverImag:coverImag.url || "",
    email,
    password,
    userName:userName.toLowerCase()
   })

  const createdUser =await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser){
     throw new ApiError(500,"Something went wrong while creating user ")
  }
   
  return res.status(201).json(
     new ApiResponces(200,createdUser,"user regristed Succrssfuly")
  )
})


export {registerUser} 