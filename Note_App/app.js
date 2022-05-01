const express = require('express');
const bodyParser = require('body-parser');
const path=require("path")
var localStorage = require("localstorage");
const { redirect } = require('express/lib/response');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
let note = [{ id: 1,title:'General' ,body: 'This is  a first text' }, { id: 2, title:'Important',body: 'This is a second text' }];
console.log(path.join(__dirname))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
  return res.redirect('/');
});


//Handling the edit request
app.post('/editNote/:id', function (req, res) {
const body=req.body;
 console.log('id==',req.params.id);
  note[req.params.id-1].title=body.newtitle
  note[req.params.id-1].body=body.newNote
 console.log(note);
 return res.redirect('/');
});
app.get('/editNote/:id',  (req, res) =>{
  res.render('edit', {
    id: req.params.id
   
   });
 return 
});   
//Handle the save note
var savenote=[];
app.post('/saveNote/:id',(req,res)=>{
  let saveobj={}; 
obj=[req.params.id];
localStorage.setItem('object'  ,JSON.stringify(obj));
   saveobj=JSON.parse(localStorage.getItem('object'));
   saveobj.title=note[req.params.id-1].title;
   saveobj.body=note[req.params.id-1].body;
  savenote.push(saveobj);
  console.log('Save Note = ',savenote);
 return res.redirect('/');
  });

app.listen(5000, function () {
  console.log("NoteApp server is running at port 5000...")
});
