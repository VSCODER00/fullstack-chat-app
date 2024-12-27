const jwt=require('jsonwebtoken')
const User=require('../models/user.model')

const protectRoute=async(req,res,next)=>{
const token=req.cookies.jwt
    if(!token){
        return res.status(401).json({message:"Unauthorized- no token provided"})
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    if(!decoded){
        return res.status(401).json({ message: "Unauthorized- invalid token" });
    }
    const user=await User.findById(decoded.userId).select('-password')
    req.user=user
    next()
}

module.exports=protectRoute