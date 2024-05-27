var express=require("express");
var app=express();
var mongodb=require("mongodb");
var session=require("express-session");
var alert=require("alert");
var ObjectId=mongodb.ObjectId;
app.use(session({
    secret:"shilpa",
    saveUninitialized:true,
    resave:true
}))
var mongoClient=mongodb.MongoClient;
var router=express.Router();
app.use(express.static("public/"));
const{connect}=require("mongodb");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var url="mongodb://127.0.0.1:27017/MOBILE SHOP MANAGEMENT";
async function MongoObj(){
    var dbo=await db.db();
    return dbo;
}
app.get("/",async function(req,res){
    var dbo=await db.MongoObj();
    var data=await dbo.collection("Res").find().toArray();
    console.log(data);
    var obj={'login_data':data}
    res.render("index.html")

});
app.post("/action_page",async function(req,res){
    console.log("req.body");
    var dbo=await MongoObj();
    var data=await dbo.collection('Login').find({'uname':req.body.uname,'password':req.body.psw}).toArray();
    if (data.length>0)
    {
         console.log(data);
        req.session['user_id']=data[0]['_id'];
        res.redirect("/main_page")
    }else{
        res.send("login failed");
    }
   
});
app.get("/main_page",async function(req,res){
    res.render("main_page.ejs");
});

//CUSTOMER
app.get("/customer",async function(req,res)
{
    if (req.session.user_id)
    {
    var dbo=await MongoObj();
    var data=await dbo.collection('customer').find().toArray();
    console.log(data);
    var obj={'customer_data':data}
    
    res.render("customer.ejs",obj);
    }
    else{
        res.redirect("/");
    }
});

app.post("/cust_details",async function(req,res){
    var dbo=await MongoObj();
    var customerData=req.body;
   var data= await dbo.collection('customer').insertOne(customerData);
    alert("Customer Details recorded Successfully");
    
    
});
app.get("/print_all_customer",async function(req,res){
    var dbo=await MongoObj();
    var data=await dbo.collection('customer').find().toArray();
    var obj={"customer_data":data};
   
    res.render("print_all_customer.ejs",obj);
});
app.get("/editcustomer/:customer_id",async function(req,res)
{
    var dbo=await MongoObj();
    var data=await dbo.collection('customer').find({'_id':ObjectId(req.params.customer_id)}).toArray();
    var obj={"customer_det":data};
    res.render("editcustomer.ejs",obj);
});
app.post("/saveeditedcustomer",async function(req,res){
    console.log(req.body);
    var newData={
             'customer_id':req.body.customer_id,
            'customername':req.body.customername,
            'Custphone':req.body.Custphone,
            'Customeraddress':req.body.Customeraddress,
            'Custmail':req.body.Custmail,
        };
    var dbo=await MongoObj();
    await dbo.collection("customer").updateOne({'_id':ObjectId(req.body.customer_id)},{
        $set : newData
    });
    
    res.redirect("/print_all_customer");
});


//EMPLOYEE FROM
app.get("/employee",async function(req,res)
{
    if (req.session.user_id)
    {
    var dbo=await MongoObj();
    
    var data=await dbo.collection('Employee').find().toArray();
    console.log(data);
    var obj={'employee_data':data}
    //dat to send must be in object
    res.render("employee.ejs",obj);
    }
    else{
        res.redirect("/");
    }
});
app.post("/emp_details",async function(req,res){
    var dbo=await MongoObj();
    var employeeData=req.body;
   var data= await dbo.collection('Employee').insertOne(employeeData);
    
    res.redirect("/employee");
    alert("Employee Details recorded Successfully");
});
app.get("/print_all_employee",async function(req,res){
    var dbo=await MongoObj();
    var data=await dbo.collection('Employee').find().toArray();
    var obj={"employee_data":data};
    // res.send(obj);
    res.render("print_all_employee.ejs",obj);
});
app.get("/editemployee/:emp_id",async function(req,res)
{
    var dbo=await MongoObj();
    var data=await dbo.collection('Employee').find({'_id':ObjectId(req.params.emp_id)}).toArray();
    var obj={"employee_det":data};
    res.render("editemployee.ejs",obj);
});
app.post("/saveeditedemployee",async function(req,res){
    console.log(req.body);
    var newData={
            'emp_id':req.body.emp_id,
            'ename':req.body.ename,
            'eaddress':req.body.eaddress,
            'ephone':req.body.ephone,
            'email':req.body.email,
            'esalary':req.body.esalary
        };
    var dbo=await MongoObj();
    await dbo.collection("Employee").updateOne({'_id':ObjectId(req.body.emp_id)},{
        $set : newData
    });
    

    // res.send("Data Received");
    res.redirect("/print_all_employee");
});
//mobile from
app.get("/mobile%20details",async function(req,res)
{
    if (req.session.user_id)
    {
    var dbo=await MongoObj();
    
    var data=await dbo.collection('Mobile').find().toArray();
    console.log(data);
    var obj={'mobile_data':data}
    //dat to send must be in object
    res.render("mobile.ejs",obj);
    }
    else{
        res.redirect("/");
    }
});
app.post("/saveproduct",async function(req,res){
    console.log(req.files);
    req.files.mobile_images.mv('public/uploads/'+req.files.mobile_images.name);
    req.body.mobile_images=req.files.mobile_images.name;
    var dbo=await MongoObj();
    var MobileData=req.body;
   var data= await dbo.collection('Mobile').insertOne(MobileData);
    
    res.redirect("/print_all_mobile");
    alert("Mobile Details recorded Successfully");
});
app.get("/print_all_mobile",async function(req,res){
    var dbo=await MongoObj();
    var data=await dbo.collection('Mobile').find().toArray();
    var obj={"mobile_data":data};
    // res.send(obj);
    res.render("print_all_Mobile.ejs",obj);
});
app.get("/editmobile/:mobile_id",async function(req,res)
{
    var dbo=await MongoObj();
    var data=await dbo.collection('Mobile').find({'_id':ObjectId(req.params.mobile_id)}).toArray();
    var obj={"mobile_det":data};
    res.render("editmobile.ejs",obj);
});
app.post("/saveeditedmobile",async function(req,res){
    console.log(req.body);
    var newData={
        'mobile_images':req.body.mobile_images,
         'model/color':req.body.model/color,
          'commodity':req.body.commodity,
            'camera':req.body.camera,
          'screen size':req.body.screensize,
       'battery':req.body.battery,
       'net quantity':req.body.netquantity, 
      'net contents':req.body.netcontents,
        'month&year manufacture':req.body.month&yearmanufacture
        
        };
    var dbo=await MongoObj();
    await dbo.collection("Mobile").updateOne({'_id':ObjectId(req.body.mobile_id)},{
        $set : newData
    });
    

    // res.send("Data Received");
    res.redirect("/print_all_Mobile");
});


//SELLING FROM

app.get("/selling",async function(req,res)
{
    if (req.session.user_id)
    {
    var dbo=await MongoObj();
    
    var data=await dbo.collection('Sell').find().toArray();
    console.log(data);
    var obj={'Sell_data':data}
    //dat to send must be in object
    res.render("selling.ejs",obj);
    }
    else{
        res.redirect("/");
    }
});
app.post("/selling_details",async function(req,res){
    var dbo=await MongoObj();
    var SellData=req.body;
   var data= await dbo.collection('Sell').insertOne(SellData);
    
    res.redirect("/selling");
    alert("Selled Details recorded Successfully");
});
app.get("/print_all_selling",async function(req,res){
    var dbo=await MongoObj();
    var data=await dbo.collection('Sell').find().toArray();
    var obj={"sell_data":data};
    // res.send(obj);
    res.render("print_all_selling.ejs",obj);
});
app.get("/editselling/:selling_id",async function(req,res)
{
    var dbo=await MongoObj();
    var data=await dbo.collection('Sell').find({'_id':ObjectId(req.params.selling_id)}).toArray();
    var obj={"sell_det":data};
    res.render("editselling.ejs",obj);
});
app.post("/saveeditedselling",async function(req,res){
    console.log(req.body);
    var newData={
             'uname':req.body.uname,
            'mobile':req.body.mobile,
            'address':req.body.address,
            'date':req.body.date,
            'mobileid':req.body.mobileid,
            'brand':req.body.brand,
            'model':req.body.model,
            'dealerid':req.body.dealerid
        };
    var dbo=await MongoObj();
    await dbo.collection("Sell").updateOne({'_id':ObjectId(req.body.selling_id)},{
        $set : newData
    });
    

    // res.send("Data Received");
    res.redirect("/print_all_selling");
});

//BILL
app.post("/savebill",async function(req,res){
    var orderDetails=await query.select_where('order_tbl',{'hotel_table_id':req.body.hotel_table_id,'status':'processing'});
    var date=new Date();
    var data=await execute(`UPDATE order_tbl SET 
                            order_amt='${req.body.order_amt}',
                            paid_amt='${req.body.paid_amt}',
                            pending_amt='${req.body.pending_amt}',
                            exit_time='${date.getHours()}:${date.getMinutes()}',
                            status='complete'
                            WHERE order_tbl_id='${orderDetails[0].order_tbl_id}'
                            `);
    var udatetable=await execute("UPDATE hotel_table SET status='free' WHERE hotel_table_id='"+req.body.hotel_table_id+"'");
    res.redirect("/admin/printbill/"+orderDetails[0].order_tbl_id);
});
app.get("/printbill/:order_id",async function(req,res)
{
    var order_id=req.params.order_id;
    var orderDetails=await query.select_where('order_tbl',{'order_tbl_id':order_id});

    var orderDishes=await query.select_where('order_dishes',{'order_id':order_id});
    console.log(orderDetails);
    res.render(`admin/print_bill.ejs`,{'orderDetails':orderDetails,'orderDishes':orderDishes});
});
// app.get("/", function(req,res)
// {
// res.render("login.ejs");
// });

app.listen(4000);
