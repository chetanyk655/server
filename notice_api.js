import app from 'index.js';
import express from 'express';
const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',     // Your MySQL host
    user: 'root',          // Your MySQL username
    password: 'SocietyMAACDK@24',  // Your MySQL password
    database: 'member' // Your MySQL database
  })

  module.exports = pool.promisePool;

  app.use(express.json());
  app.use(express.urlencoded({
      extended : true
  }));

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
