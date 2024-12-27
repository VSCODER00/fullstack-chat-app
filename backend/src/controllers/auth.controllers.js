const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const cloudinary= require("../lib/cloudinary.js");
const generateToken = require("../lib/utils");

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All the fields are required" });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    fullName,
    email,
    password: hashedpassword,
  });
  if (newUser) {
    generateToken(newUser._id, res);
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "No such user found" });
  }
  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    return res.status(400).json({message:"Invalid credentials"})
  }
  generateToken(user._id,res)
  res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profilePic: user.profilePic,
  })
};

const logout = (req, res) => {
  res.cookie("jwt","",{maxAge:0})
  res.status(200).json({message:"Logged out successfully"})
};

const updateProfile=async(req,res)=>{
  const {profilePic}=req.body
  const userId=req.user._id
  if(!profilePic){
    return res.status(400).json({message:"Profile Pic is required"})
  }
  const uploadResponse=await cloudinary.uploader.upload(profilePic)
  const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
  res.status(200).json(updatedUser)
}

const checkAuth=(req,res)=>{
  
  res.status(200).json(req.user)
  
  
  
}

module.exports = { signup, login, logout,updateProfile,checkAuth };
