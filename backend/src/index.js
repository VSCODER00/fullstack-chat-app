const express=require('express')
const path=require('path')
const cors=require('cors')
require("dotenv").config();
const connectDB=require('./lib/db')
const authRoutes=require('./routes/auth.route');
const messageRoutes=require('./routes/message.route')
const cookieParser=require('cookie-parser')
const {io,app,server}=require('./lib/socket')

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))
app.use(express.json({ limit: "50mb" }));

// Increase URL-encoded payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/message',messageRoutes)


const PORT=process.env.PORT

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get('*',(req,res)=>{
        res.sendFile(
          path.join(__dirname, "../", "frontend", "dist", "index.html")
        );

    })
}
const start=async ()=>{
    try{    
        await connectDB(process.env.MONGO_URI)
        server.listen(PORT,()=>{
        console.log(`server is listening on port ${PORT}`);
        })
    }
    catch(error){
        console.log(error);
    }
}
start()