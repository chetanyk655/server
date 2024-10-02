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

router.post("/", upload.single('image'),(req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
    
        const { originalname, buffer } = req.file;
        const { p_name, price, descp,filename } = req.body;

        // Insert image data into the database
        const query = 'INSERT INTO marketplace (p_name, price, descp,filename, image) VALUES (?, ?, ?,?,?)';
        membersDb.query(query, [p_name,price,descp,filename,buffer], (err, results) => {
            if (err) {
                console.error('Error inserting image into database:', err);
                return res.status(500).send('Error saving the file to database.');
            }
            res.send(`File uploaded and saved to database successfully with ID: ${results.insertId}`);
        });
    } catch (e) {
        console.log(e);
    }

})

router.get("/", (req, res) => {
    const sql = 'SELECT * FROM marketplace';
    membersDb.query(sql, (err, results) => {
        if (err) {
            console.error('Error retrieving image from database:', err);
            return res.status(500).send('Error retrieving image.');
        }
        
        if (results.length === 0) {
            return res.status(404).send({
                "status_code"  : 404,
                "response" : "No Products Available"
            });
        }
        let i = 0;
        while(i < results.length){
             results[i].image = `data:image/jpeg;base64,${results[i].image.toString('base64')}`;
             i++;
        }

        res.status(200).send({
            "status_code": 200,
            "response": {
                "products": results,
            },
            "total_prod" : i
        });
        
    });
});


module.exports = router;