const express = require('express')
const app = express()
const port = 3000;
const path=require("path");
const Chat=require("./models/chat.js")
const ExpressError = require('./expresserror.js');
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
app.get("/", (req, res) => {
  res.send("working");
});

app.get('/chat', async (req, res, next) => {
  try {
    let chatt = await Chat.find();
    res.render("app.ejs", { chatt });
  } catch (err) {
    next(err);
  }
});

app.get('/chat/new', (req, res) => {
  res.render("new.ejs");
});

app.post('/chat', async (req, res, next) => {
  try {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date()
    });

    await newChat.save();
    console.log("chat is saved");
    res.redirect("/chat");
  } catch (err) {
    next(err);
  }
});

app.get('/chat/:id/edit', async (req, res, next) => {
  try {
    let { id } = req.params;
    let chatid = await Chat.findById(id);
    res.render("edit.ejs", { chatid });
  } catch (err) {
    next(err);
  }
});

app.get('/chat/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let chatid = await Chat.findById(id);
    res.render("edit.ejs", { chatid });
  } catch (err) {
    next(err);
  }
});

app.put('/chat/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let { msg: newmsg } = req.body;
    let chatid = await Chat.findByIdAndUpdate(
      id,
      { msg: newmsg },
      { runValidators: true, new: true }
    );
    console.log(chatid);
    res.redirect("/chat");
  } catch (err) {
    next(err);
  }
});

app.delete('/chat/:id', async (req, res, next) => {
  try {
    let { id } = req.params;
    let chatdEL = await Chat.findByIdAndDelete(id);
    console.log(chatdEL);
    res.redirect("/chat");
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  let { status = 500, message = "some error" } = err;
  res.status(status).send(message);
});

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});
