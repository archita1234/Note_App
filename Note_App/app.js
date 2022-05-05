const express = require('express');
const bodyParser = require('body-parser');
const path=require("path")
var localStorage = require("localstorage");
const { redirect } = require('express/lib/response');
const app = express();
const mongoose =require("mongoose");
const { stringify } = require('querystring');
const db = require('./db');
mongoose.connect("mongodb://localhost:27017/NoteDB", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("connection successfull..."))
.catch((err)=>console.log(err));
app.use(bodyParser.urlencoded({
  extended: true
}));
var notee=require('./db.js');

let note = [];
console.log(path.join(__dirname))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// const createDocument=async ()=>{
//   try{
//    const demo=new notee({
//      id:0,
//      title:"title",
//      body:"Subject"
//    })
//    const result=await demo.save();
//    console.log(demo);
//   }catch(err){
//     console.log(err);
//   }
// }
// createDocument();
const getDocument=async()=>{
  const result=await notee.find();
  //console.log(typeof(result));
  note=result;
  console.log(`Already Save Note to Database =  ${result}`);
}
getDocument();
app.get('/', function (req, res) {
 res.render('index', {
   note: note
  });
});

//then, we use app.post option.
app.post("/addNotes", function (req, res) {
  const userNote = {};
 userNote.id = note.length+1;
 userNote.title=req.body.newtitle
  userNote.body = req.body.newNote
  note.push(userNote);

  //then we redirect it to the root route
  res.redirect('/');
});

//Handling the delete request
app.get('/deleteNote/:id', function (req, res) {
  console.log(req.params.id);
  const deleteNotes = note.filter(item => item.id != req.params.id);
  note = deleteNotes;
  notee.deleteMany({id:req.params.id}).then(function(){
  console.log(`Deleted NOTE ID = ${req.params.id} from database`)
   });
  return res.redirect('/');
});
//Handling the edit request
app.post('/editNote/:id', function (req, res) {
const body=req.body;
  note[req.params.id-1].title=body.newtitle
   note[req.params.id-1].body=body.newNote
  
 notee.findOneAndUpdate({id:req.params.id},{
   $set :{
      'title':body.newtitle,
      'body':body.newNote
   }
 }).then(result=>{
  console.log(`Updated NOTE ID = ${req.params.id}`);
 })
 return res.redirect('/');
});
app.get('/editNote/:id',  (req, res) =>{
  res.render('edit', {
    id: req.params.id
   
   });
 return 
});   
//Handle the save note
app.post('/saveNote/:id',(req,res)=>{
var saveid=req.params.id;
var myData = new notee({
  'id':saveid,
  'title':note[saveid-1].title,
  'body':note[saveid-1].body
});
myData.save()
  .then(item => {
    console.log(`Save NOTE ID  = ${saveid} to database` )
  
  })
  .catch(err => {
    res.status(400).send("unable to save to database");
  });

 return res.redirect('/');
  });

app.listen(5000, function () {
  console.log("NoteApp server is running at port 5000...")
});
