const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const multer = require('multer');
const router = express.Router();
router.use(cors());
const { membersDb, accountsDb, adminsDb } = require('../config/db')
const storage = multer.memoryStorage(); // Store in memory for database insertion
const upload = multer({ storage });
//api for admin to put notice 
router.post("/withFile",upload.single('file'),(req,res)=>{
    const date = new Date();
    const sql = `INSERT INTO notice (contents,date,time,file,filename) VALUES(?,?,?,?,?)`;
    try{
         const {originalname,buffer} = req.file;
         const {contents} = req.body;
          adminsDb.query(sql,[contents,`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,buffer,originalname],(err,result)=>{
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


router.post("/withoutFile",(req,res)=>{
    const date = new Date();
    const sql = `INSERT INTO notice (contents,date,time) VALUES(?,?,?)`;
    try{
         
         const {contents} = req.body;
          adminsDb.query(sql,[contents,`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`],(err,result)=>{
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
    return new Date(year, month, 0).getDate(); // Day 0 of the next month gives the last day of the current month
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
        console.log(pastTenDaysDate)
        console.log(daysInMonth)
    
        for(let i = 0,j=1;i <= 10;i++){
            if(new Date(pastTenDaysDate).getDate()+i <= daysInMonth){
                dates.push(`${pastTenDaysDate.slice(0,7)}-${parseInt(pastTenDaysDate.slice(8))+i}`);
            }
            else{
                dates.push(`${pastTenDaysDate.slice(0,5)}${parseInt(pastTenDaysDate.slice(5,7))+1}-${j}`);
                j++;
            }
        }
        return dates;
    }

//api for member to see notices
router.get("/",(req,res)=>{
    const datesList = getDates();
    console.log(datesList);
    const sql = `SELECT * FROM notice WHERE date IN ("${datesList[0]}","${datesList[1]}","${datesList[2]}","${datesList[3]}","${datesList[4]}","${datesList[5]}","${datesList[6]}","${datesList[7]}","${datesList[8]}","${datesList[9]}","${datesList[10]}")`
    adminsDb.query(sql,(err,result)=>{

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
                "response" : "No notice found"
            })
            return;
        }
        for(let i = 0 ; i <result.length ; i++){
             result[i]['file'] = "";
        }
        console.log(result);
        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })

    })
})

router.get("/file",(req,res)=>{
    const date = req.query.date;
    const time = req.query.time;
    const sql = `SELECT filename,file FROM notice WHERE date="${date}" AND time="${time}"`;
    adminsDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send("Internal Server Error");
            return;
        }

        if(result.length == 0){
            res.status(404).send({
                "status_code" : 404,
                "response" : "Cant find the file"
            })
            return;
        }

        res.status(200).send({
            "status_code"  :200,
            "response" : result,
        })
    })
})

module.exports = router;