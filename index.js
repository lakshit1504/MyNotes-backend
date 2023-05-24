const express=require('express');
const server=express();
const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

main().catch(err => console.log(err));
const Route=express.Router(); 
const userRouter=require('./routes/notes')
const authRouter=require('./routes/auth')
var cors=require('cors')

async function main() {
    await mongoose.connect('mongodb+srv://lakshitkujuneja:Ha7BtiC4OVl37ySq@cluster0.cn69522.mongodb.net/?retryWrites=true&w=majority');
        console.log('database connected');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
  server.get('/notes',(req,res)=>{
    res.json('whassup');
  })

server.use(cors({
  origin :["http://localhost:/3000","https://mynotes-t5w6.onrender.com"]
}))
server.use(express.json());
server.use('/api/auth',authRouter.Route);
server.use('/api/notes',userRouter.Route);

  server.listen(8080,(req,res)=>{
    console.log('iNoteBook listening at port 8080')
})