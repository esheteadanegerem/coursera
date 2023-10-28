const express = require('express');
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken');

const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const UserModel=require('./router/users.js')
const app = express();

app.use(express.json());
app.use(
    session({
      secret: "mysecret", 
      resave: false,
      saveUninitialized: true,
    })
  );
const url='mongodb://127.0.0.1:27017/coursera'

mongoose.connect(url)
.then(()=>{console.log('mongodb is conncetd')})
.catch((error)=>{console.log(error)})
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
app.post('/register',async(req,res)=>{
    const {username,password}=req.body
   await UserModel.find(username)
   try{
    if(username){
        res.json('user already exist please login')
    }
    else{
       await UserModel.create({username:username,password:password})
         .then(user=>{res.j})
    }
   }
   catch{
    res.json('error occure during regisration')
   }
})


app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
