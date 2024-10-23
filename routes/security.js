const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const router = express.Router();
const { membersDb, accountsDb, adminsDb } = require('../config/db')
router.use(cors());
const storage = multer.memoryStorage(); // Store in memory for database insertion
const upload = multer({ storage });

router.post("/",upload.single('image'),(req,res)=>{

    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
    
        const { originalname, buffer } = req.file;
        const { ph_no, flat_no, reason,filename } = req.body;

        // Insert image data into the database
        const sql = `INSERT INTO security (image,filename,reason,flat_no,ph_no) VALUES (?,?,?,?,?)`;
        accountsDb.query(sql, [buffer,filename,reason,flat_no,ph_no], (err, results) => {
            if (err) {
                console.error('Error inserting image into database:', err);
                return res.status(500).send('Error saving the file to database.');
            }
            console.log(results)
            if(err){
                console.log(err);
                res.status(500).send({
                    "status_Code" : 500,
                    "response" : "Internal Server Error"
                })
                return;
            }
            res.status(200).send({
                "status_code"  : 200,
                "response" : "Successfully Stored user details"
            })
        });
    } catch (e) {
        console.log(e);
    }
})

router.get("/",(req,res)=>{
    const sql = `SELECT * FROM member_accounts WHERE email = "${req.query.email}"`
    accountsDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 500,
                "response" : "Internal Server Error"
            })
            return;
        }
        if(result.length == 0 ){
            res.status(404).send({
                "status_code" : 404,
                "response" : "No such member Exist"
            })
            return;
        }
        const sql = `SELECT * FROM security WHERE ph_no = "${result[0]['ph_no']}"`;
        accountsDb.query(sql, (err, results) => {
            if (err) {
                console.error('Error retrieving image from database:', err);
                 res.status(500).send('Error retrieving image.');
                 return;
            }
            
            if (results.length === 0) {
                 res.status(404).send({
                    "status_code"  : 404,
                    "response" : "No Security Enquiries Available"
                });
                return;
            }
         let i = 0;
            while(i < results.length){
                results[i].image = `data:image/jpeg;base64,${results[i].image.toString('base64')}`;
                i++;
            }
    
            res.status(200).send({
                "status_code": 200,
                "response": 
                     results,
                "total_queries"  : i,
            });
            
        });
    })
    
    

})

module.exports = router;