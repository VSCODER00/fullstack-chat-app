const User=require('../models/user.model')
const Message=require('../models/message.model')
const cloudinary=require('cloudinary')
const {io}=require('../lib/socket')
const { getRecieverSocketId } = require('../lib/socket')
const getUsersforSideBar=async(req,res)=>{
    const loggedInUserid=req.user._id
    const filteredUser=await User.find({_id:{$ne:loggedInUserid}}).select("-password")
    res.status(200).json(filteredUser)

}

const getMessages=async(req,res)=>{
    const {id:userToChatID}=req.params
    const myId=req.user._id
    const messages=await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChatID},
            {senderId:userToChatID,receiverId:myId}
        ],
    })
    res.status(200).json(messages)
}

const sendMessages=async(req,res)=>{
    const {text,image}=req.body
    const {id:receiverId}=req.params
    const senderId=req.user._id
    let imageUrl
    if(image){
        const uploadResponse=await cloudinary.uploader.upload(image)
        imageUrl=uploadResponse.secure_url
    }
    const newMessage=new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
    })
    await newMessage.save()

    //socket.io
    const receiverSocketId=getRecieverSocketId(receiverId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit('newMessage',newMessage) 
    }  
    res.status(201).json(newMessage)

}
module.exports={getUsersforSideBar,getMessages,sendMessages}