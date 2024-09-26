
const express = require("express")
const mysql = require('mysql2')
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
  host: 'localhost',     // Your MySQL host
  user: 'root',          // Your MySQL username
  password: 'SocietyMAACDK@24',  // Your MySQL password
  database: 'accounts' // Your MySQL database
})
module.exports = pool.promisePool;

 const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended : true
}));


let details = {};
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`);
})

app.post("/api/send",(req,res)=>{
    console.log("Results",req.body);
    details = {
        "name" : req.body.name,
        "city" : req.body.city,
        "state" : req.body.state
    }

    console.log("final result",details);
    res.status(200).send({
        "status_code" : 200,
        "message" : "Details are added",
        "details" : details
    })
})

app.get("/api/getdetails",(req,res)=>{
    try{
    res.status(200).send({
        "status_code" : 200,
        "details" : details
    })
    }catch(e){
        console.err(e);
    }
})


app.post("/api/checklogin",(req,res) =>{
    const {email,password,isAdmin} = req.body;

    if(!isAdmin){
    const sql = `SELECT * FROM member_accounts WHERE email = "${email}"`
    pool.query(sql,(err,result)=>{
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
        pool.query(sql,(err,result)=>{
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
    console.log(req.body)
  const { name, password,email ,isAdmin,house_no} = req.body;
    let tableSelected;
  // Check if user already exists

  if(isAdmin){
   table = "admin_accounts"
  }else{
    table = "member_accounts"
  }
  const checkUserQuery = `SELECT * FROM ${table} WHERE  email = "${email}"`;
  pool.query(checkUserQuery, async (err, results) => {
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
        pool.query(query, [ name,hashedPassword,email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving admin');
        }
        res.status(200).send('Admin registered successfully');
        console.log("Done",result);
        });
    }else{
        const query = `INSERT INTO ${table} (name,house_no, password,email) VALUES (?,?,?,?)`;
        pool.query(query, [ name,house_no,hashedPassword,email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error saving user');
        }
        res.status(200).send('User registered successfully');
        console.log("Done",result);
        });
    }
    
  });
});

//api for admin to put notice 
app.post("/api/store-notice",(req,res)=>{
    const content = req.body.contents;
    const date = new Date();
    const sql = `INSERT INTO notice (contents,date,time) VALUES(?,?,?)`;
    try{
        pool.query(sql,[content,`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`],(err,result)=>{
            if(err){
                return res.status(500).send({
                    "status_code" : 500,
                    "response" : "Error Saving  Notice"
                });
            }

            res.status(200).send({
                "status_code" : 200,
                "response" : "Success"
            })

        })
    }catch(e){
        console.log(e);
    }
})


function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate(); // Day 0 of the next month gives the last day of the current month
}
const getDates = ()=>{
    const date = new Date();
        let daysInMonth = null; 
    
        if(date.getMonth() == 2 && date.getDate() <= 10){
            if(date.getFullYear()%4==0){
                daysInMonth = 29
            }
            else{
                daysInMonth = 28
            }
        }
        else{
        daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth()-1);
        }
    
        let pastTenDaysDate = "";
        if(date.getDate() <= 10){
            switch(daysInMonth){
                case 31 : pastTenDaysDate = `${date.getFullYear()}-${date.getMonth()}-${31+(date.getDate()-10)}`;break;
                case 30 : pastTenDaysDate = `${date.getFullYear()}-${date.getMonth()}-${30+(date.getDate()-10)}`;break;
                case 29 : pastTenDaysDate = `${date.getFullYear()}-${date.getMonth()}-${29+(date.getDate()-10)}`;break;
                case 28 : pastTenDaysDate = `${date.getFullYear()}-${date.getMonth()}-${28+(date.getDate()-10)}`;break;
            }
        }else{
            pastTenDaysDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()-10}`;
        }
    
        let dates =[];
    
        for(let i = 0,j=1;i <= 10;i++){
            if(new Date(pastTenDaysDate).getDate()+i <= daysInMonth){
                dates.push(`${pastTenDaysDate.slice(0,7)}${parseInt(pastTenDaysDate.slice(7))+i}`);
            }
            else{
                dates.push(`${pastTenDaysDate.slice(0,5)}${parseInt(pastTenDaysDate.slice(5,7))+1}-${j}`);
                j++;
            }
        }
        return dates;
    }


//api for member to see notices
app.get("/api/get-notice",(req,res)=>{
    const datesList = getDates();
    const sql = `SELECT * FROM notice WHERE date IN ("${datesList[0]}","${datesList[1]}","${datesList[2]}","${datesList[3]}","${datesList[4]}","${datesList[5]}","${datesList[6]}","${datesList[7]}","${datesList[8]}","${datesList[9]}","${datesList[10]}")`
    pool.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 500,
                "response" : "Error Fetching Notice"
            })
        }
        if(result.length == 0){
            res.status(404).send({
                "status_code" : 404,
                "respone" : "No notice found"
            })
            return;
        }

        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })

    })
})
