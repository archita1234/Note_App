var mongoose =require("mongoose");
const noteSchema=new mongoose.Schema({
    id:Number,
    title:String,
    body:String
 });
 module.exports=new mongoose.model("notee",noteSchema);
