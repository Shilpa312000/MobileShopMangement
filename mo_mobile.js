var express=require("express");
var bodyParser=require("body-parser");

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gfg');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/',function(req,res){
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('./public/mobile.html');
	}).listen(8006);
	
app.post('/mobile_details', function(req,res){
	var mobile_id = req.body.mobile_id;
	var mobilename =req.body.mobilename;
    var manufact_date=req.body.manufact_date;
    var price=req.body.price;

	var data = {
		"mobile_Id": mob_Id,
		"mobilename":mobname,
		"manufact_date":manufact_date,
		"price":price,
	}
db.collection('mobile').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('./public/mobile_success.html');
})

console.log("server listening at port 8006");
