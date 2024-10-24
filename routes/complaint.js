const express = require('express');
const router = express.Router();
const {membersDb} = require('../config/db')
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store in memory for database insertion
const upload = multer({ storage });

router.post("/",upload.single('image'),(req,res)=>{

    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
    
        const { originalname, buffer } = req.file;
        const { message,filename,email } = req.body;

        // Insert image data into the database
        const query = 'INSERT INTO complaints (complaint,date,time,filename, image,usr_mail) VALUES (?,?,?,?,?,?)';
        membersDb.query(query, [message,`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,filename,buffer,email], (err, results) => {
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

function getDaysInMonth(year, month) {
    return new Date(year, month , 0).getDate(); // Day 0 of the next month gives the last day of the current month
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
                dates.push(`${pastTenDaysDate.slice(0,7)}-${parseInt(pastTenDaysDate.slice(7))+i}`);
            }
            else{
                dates.push(`${pastTenDaysDate.slice(0,5)}${parseInt(pastTenDaysDate.slice(5,7))+1}-${j}`);
                j++;
            }
        }
        return dates;
    }
router.get("/emailComplaints",(req,res)=>{
    const sql = `SELECT * FROM complaints WHERE usr_mail = "${req.query.email}"`;
    membersDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 500,
                "reponse" : "Internal server error"
            });
            return;
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })
    })
})
router.get("/",(req,res)=>{
    const dates = getDates();
    const sql = `SELECT * FROM complaints WHERE date IN ("${dates[0]}","${dates[1]}","${dates[2]}","${dates[3]}","${dates[4]}","${dates[5]}","${dates[6]}","${dates[7]}","${dates[8]}","${dates[9]}","${dates[10]}")`;
    membersDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })
    })
})

router.put('/',(req,res)=>{
    const email = req.query.email;
    const id = req.query.id;
    const {AdminStatus} = req.body;

     const sql = `UPDATE complaints SET c_status = "${AdminStatus}" WHERE usr_mail = "${email}" AND c_id="${id}"`

    membersDb.query(sql,(err,result1)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 500,
                "response" : "Internal Server Error"
            })
            return;
        }

        res.status(200).send({
            "status_code" : 200,
            "response" : "Successfully updated facility status"
        })
       
    })
})

module.exports = router;