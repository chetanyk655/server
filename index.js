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

pool.query("SELECT * FROM registration",(err,res)=>{
    console.log("Result",res);
 });

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
console.log()

app.post("/api/checklogin",(req,res) =>{
    const {username,password} = req.body;

    const sql = `SELECT * FROM registration WHERE username = "${username}"`
    
    pool.query(sql,(err,result)=>{
        if(result.length == 0){
            res.status(404).send({
                "status_code" : 404,
                "response"  :"User not found"
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
                    "response" : true
                })
            }else{
                res.status(401).send({
                    "status_code" : 401,
                    "response" : false
                })
            }
        })
    })

})


// Register route
app.post('/api/registration',  (req, res) => {
  const { username, password,email } = req.body;

  // Check if user already exists
  console.log(username,email);
  const checkUserQuery = `SELECT * FROM registration WHERE username = "${username}" AND email = "${email}"`;
  pool.query(checkUserQuery, async (err, results) => {
    if (results.length > 0) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user in the database
    const query = 'INSERT INTO registration (username, password,email) VALUES (?, ?,?)';
    pool.query(query, [username, hashedPassword,email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error saving user');
      }
      res.status(201).send('User registered successfully');
      console.log("Done",result);
    });
  });
});





