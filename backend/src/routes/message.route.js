const express=require('express')
const protectRoute = require('../middleware/auth.middleware')
const {
  getUsersforSideBar,
  getMessages,
  sendMessages,
} = require("../controllers/message.controller");

const router=express.Router()

router.get('/users',protectRoute,getUsersforSideBar);
router.get('/:id',protectRoute,getMessages)
router.post('/send/:id',protectRoute,sendMessages)

module.exports=router