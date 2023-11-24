const express = require('express')
const app = express()
const port = 3000;
const path=require("path");
const Chat=require("./models/chat.js")
const { v4: uuidv4 } = require('uuid');
var methodOverride = require('method-override')
app.use(express.static(path.join(__dirname,"public")));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const mongoose = require('mongoose');
main().then((res)=>{
    console.log("mongoose connection sucess")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/telegram');

}
// insert 
// let chat1=new Chat({
//   from:"savitha",
//   to:"sandeep",
//   msg:"hi can you help me san ",
//   created_at: new Date()
// });
// chat1.save().then((res)=>{console.log(res)})

app.get('/chat', async (req, res) => {
  // from the database extract data
  let chatt = await Chat.find();
  res.render("app.ejs", {chatt}); // Pass the variable as an object property
});
// create route
app.get('/chat/new', async (req, res) => {
  res.render("new.ejs"); // Pass the variable as an object property
});

app.post('/chat', async (req, res) => {
   let {from,to,msg}=req.body;
   let newChat= new Chat({
    from:from,
    to:to,
    msg:msg,
    created_at:new Date()
   });
   newChat.save().then(()=>{console.log("chat is saved")})
   res.redirect("/chat");
});


// edit 
app.get('/chat/:id/edit', async (req, res) => {
  let {id}=req.params;
  let chatid= await Chat.findById(id);
  res.render("edit.ejs",{chatid}); // Pass the variable as an object property
});  
app.put('/chat/:id', async (req, res) => {
  let {id}=req.params;
  let {msg:newmsg}=req.body;
  let chatid= await Chat.findByIdAndUpdate(
    id,
    {msg:newmsg},
    {runValidators:true,new:true});
    console.log(chatid)
    res.redirect("/chat")
});

app.delete('/chat/:id', async (req, res) => {
  let {id}=req.params;
  let chatdEL= await Chat.findByIdAndDelete(id);
  console.log(chatdEL);
  res.redirect("/chat"); // Pass the variable as an object property
});  


app.listen(port, () => {
  console.log(` express is  listening on port ${port}`)
});