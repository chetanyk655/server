const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const router = express.Router();
const { membersDb, accountsDb, adminsDb } = require('../config/db')

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
        membersDb.query(sql, [buffer,filename,reason,flat_no,ph_no], (err, results) => {
            if (err) {
                console.error('Error inserting image into database:', err);
                return res.status(500).send('Error saving the file to database.');
            }
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
    const {email} = req.query.email;
    const sql = `SELECT * FROM security WHERE email = "${email}"`;
    adminsDb.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving image from database:', err);
            return res.status(500).send('Error retrieving image.');
        }
        
        if (results.length === 0) {
            return res.status(404).send({
                "status_code"  : 404,
                "response" : "No Security Enquiries Available"
            });
        }
    
        results.image = `data:image/jpeg;base64,${results.image.toString('base64')}`;
       

        res.status(200).send({
            "status_code": 200,
            "response": {
                "products": results,
            },
        });
        
    });

})

module.exports = router;