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
	return res.render('employee.html');
	}).listen(8003);
	
app.post('/emp_details', function(req,res){
	var emp_id = req.body.emp_id;
	var ename =req.body.ename;
	var eaddress = req.body.eaddress;
	var ephone =req.body.ephone;
    var eemail=req.body.eemail;
    var esalary=req.body.esalary;

	var data = {
		"emp_Id": emp_Id,
		"ename":ename,
		"eaddress":eaddress,
		"ephone":ephone,
        "eemail":eemail,
        "esalary":esalary,
	}
db.collection('employee').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('./public/employee_success.html');
})

console.log("server listening at port 8003");
