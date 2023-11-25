const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const Chat = require('./models/chat.js');
const ExpressError = require('./expresserror.js');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const mongoose = require('mongoose');

main().then(() => {
  console.log('mongoose connection success');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/telegram');
}

app.get('/', (req, res) => {
  res.send('working');
});

app.get('/chat', asyncWrap(async (req, res) => {
  let chatt = await Chat.find();
  res.render('app.ejs', { chatt });
}));

app.get('/chat/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/chat', asyncWrap(async (req, res) => {
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });

  await newChat.save();
  console.log('chat is saved');
  res.redirect('/chat');
}));

app.get('/chat/:id/edit', asyncWrap(async (req, res) => {
  let { id } = req.params;
  let chatid = await Chat.findById(id);
  res.render('edit.ejs', { chatid });
}));

app.get('/chat/:id', asyncWrap(async (req, res,next) => {
  let { id } = req.params;
  let chatid = await Chat.findById(id);
  if(!chatid){
    next( new ExpressError(500,"not found"));
  }
  res.render('edit.ejs', { chatid });
}));

app.put('/chat/:id', asyncWrap(async (req, res,next) => {
  let { id } = req.params;
  let { msg: newmsg } = req.body;
  let chatid = await Chat.findByIdAndUpdate(
    id,
    { msg: newmsg },
    { runValidators: true, new: true }
  );
  res.redirect('/chat');
}));

app.delete('/chat/:id', asyncWrap(async (req, res) => {
  let { id } = req.params;
  let chatdEL = await Chat.findByIdAndDelete(id);
  console.log(chatdEL);
  res.redirect('/chat');
}));

app.use((err, req, res, next) => {
  console.log(err.name);
  if(err.name == "ValidationError"){
    handleValidationErr();
  }
  next(err);
});

app.use((err, req, res, next) => {
  let { status = 500, message = 'some error' } = err;
  res.status(status).send(message);
});
const handleValidationErr=(err)=>{
  console.log("validation err please check")
  return err;
}
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});
