var express = require("express");
var app = express();
var bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));
var mongodb=require("mongodb");
var mongoClient=mongodb.MongoClient;

var url="mongodb://localhost:27017/Login";
async function MongoObj()
{
    var db=await mongoClient.connect(url);
    var dbo=await db.db();
    return dbo;
}

app.get("/",async function(req,res)
{
    var dbo=await MongoObj();
    
    var data=await dbo.collection('Login1').find().toArray();
    console.log(data);
    var obj={'Login_data':data}
   
    res.render("main_page.ejs");
});
app.post("/saveLogin",async function(req,res){
    console.log(req.body);
    var dbo=await MongoObj();
    var StudentData=req.body;
    await dbo.collection('Login').insertOne(LoginData);
    res.send("Done");
    
   
});

app.listen(1000);