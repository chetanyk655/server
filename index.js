
const express = require("express")

const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const complaintRoute = require("./routes/complaint.js")
const feedbackRoute = require("./routes/feedback.js")
const billRoute = require("./routes/bill.js")
const facilityRoute = require("./routes/facility.js")
const marketPlaceRoute = require("./routes/marketplace.js")
const contactRoute = require("./routes/contact.js")
const membersRoute = require("./routes/members.js")
const securityRoute = require("./routes/security.js")
const adminAuthRoute = require("./routes/admin_auth.js")
const noticeRoute = require("./routes/notice.js")
const cors =require('cors')

const  {accountsDb,adminsDb, membersDb} = require('./config/db.js')


 const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended : true
}));


app.use('/api/complaints',complaintRoute)
app.use('/api/feedbacks',feedbackRoute)
app.use('/api/bills',billRoute)
app.use('/api/marketplace',marketPlaceRoute)
app.use('/api/facility',facilityRoute)
app.use('/api/contact',contactRoute)
app.use('/api/members',membersRoute)
app.use('/api/security',securityRoute)
app.use('/api/admin_auth',adminAuthRoute)
app.use('/api/notice',noticeRoute)
app.use(cors())
let details = {};
const PORT = process.env.PORT || 2000;

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})
module.exports = app;

app.post("/api/checklogin",(req,res) =>{
    const {email,password,isAdmin} = req.body;

    if(!isAdmin){
    const sql = `SELECT * FROM member_accounts WHERE email = "${email}"`
    accountsDb.query(sql,(err,result)=>{
        if(result.length == 0){
            res.status(404).send({
                "status_code" : 404,
                "response"  :"User not found",
                "can_login" : false
            })
            return false;
        }
        
        bcrypt.compare(password,result[0].password,(err,isMatch)=>{
            if(err){
                throw err;
            }

            if(isMatch){
                res.status(200).send({
                    "status_code" : 200,
                    "response" : "User credentials are valid",
                    "can_login" : true
                })
            }else{
                res.status(401).send({
                    "status_code" : 401,
                    "response" : "User credentials aren't valid",
                    "can_login" : false
                })
            }
        })
    })
    }else{
        const sql = `SELECT * FROM admin_accounts WHERE email = "${email}"`
        accountsDb.query(sql,(err,result)=>{
            if(result.length == 0){
                res.status(404).send({
                "status_code" : 404,
                "response"  :"User not found",
                "can_login" : false
            }   )
            return false;
        }
        
        bcrypt.compare(password,result[0].password,(err,isMatch)=>{
            if(err){
                throw err;
            }

            if(isMatch){
                res.status(200).send({
                    "status_code" : 200,
                    "response" : "User credentials are valid",
                    "can_login" : true
                })
            }else{
                res.status(401).send({
                    "status_code" : 401,
                    "response" : "User credentials aren't valid",
                    "can_login" : false
                })
            }
        })
    })
    }

})


// Register route
app.post('/api/registration',  (req, res) => {
  const { name, password,email ,isAdmin,house_no,ph_no} = req.body;
    let tableSelected;
  // Check if user already exists

  if(isAdmin){
   table = "admin_accounts"
  }else{
    table = "member_accounts"
  }
  const checkUserQuery = `SELECT * FROM ${table} WHERE  email = "${email}"`;

  accountsDb.query(checkUserQuery, async (err, results) => {
    if (results.length > 0) {
      return res.status(400).send({
        "status_code" : 400,
        "response" :'User already exists',
        "canRegister" : false,
    });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user in the database
    if(isAdmin){
        const query = `INSERT INTO ${table} (name, password,email) VALUES (?,?,?)`;
        accountsDb.query(query, [ name,hashedPassword,email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving admin');
        }
        res.status(200).send('Admin registered successfully');
        console.log("Done");
        });
    }else{
        const query = `INSERT INTO ${table} (name,house_no, password,email,ph_no) VALUES (?,?,?,?,?)`;
        accountsDb.query(query, [ name,house_no,hashedPassword,email,ph_no], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving user');
        }
        res.status(200).send('User registered successfully');
        console.log("Done");
        });
    }
    
  });
});




/*
    member and admin reg and login - accounts db (member_accounts,admin_accounts)
    store-notice - admins db (notice)
    get-notice - members db (notice)
    bill-post - admins db(payments)
    for complaint and feedback - user can post both in members database and admins database , user and admin can get from members database and admins db resp.
*/