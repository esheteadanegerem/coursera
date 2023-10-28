const mongoose=require('mongoose')
const userScema=new mongoose.Schema({
    username:String,
    password:String
})
const UserModel=mongoose.model('users',userScema)
module.exports=UserModel;