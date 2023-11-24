const mongoose = require('mongoose');
// step1: schema
const chatSchema=new mongoose.Schema({
    from:{
        type:String,
        required:true
    },
    to:{
        type:String,
        required:true
    },
    msg:{
        type:String,
        maxLength:50,
        required:true
    },
    created_at:{
        type:Date
    }
});
// create obj for the schema
const Chat=mongoose.model("Chat",chatSchema);
module.exports=Chat;
