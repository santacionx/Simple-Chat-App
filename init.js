// assume as initial data setup
const mongoose = require('mongoose');
const Chat=require("./models/chat.js")
main().then((res)=>{
    console.log("mongoose connection success")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/telegram');

}
let allchat=[{
    from:"adam",
    to:"sandeep",
    msg:"send me notes",
    created_at: new Date()
},
{
    from:"pink",
    to:"koi",
    msg:"send me books",
    created_at: new Date()
},
{
    from:"aman",
    to:"arjun",
    msg:" handle care with notes",
    created_at: new Date()
},
{
    from:"usha",
    to:"puppy",
    msg:"send me love",
    created_at: new Date()
}
]
Chat.insertMany(allchat);
