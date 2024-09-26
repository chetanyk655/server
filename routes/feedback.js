const express = require('express');
const router = express.Router();
const pool = require('../db')

router.post("/",(req,res)=>{
    const contents = req.body.message;
    const sql = `INSERT INTO feedbacks (feedback,date,time) VALUES (?,?,?) `;

    pool.query(sql,[contents,`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`],(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : "success"
        })
    })

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

router.get("/",(req,res)=>{
    const dates = getDates();
    const sql = `SELECT * FROM feedbacks WHERE date IN ("${dates[0]}","${dates[1]}","${dates[2]}","${dates[3]}","${dates[4]}","${dates[5]}","${dates[6]}","${dates[7]}","${dates[8]}","${dates[9]}","${dates[10]}")`;
    pool.query(sql,(err,result)=>{
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
module.exports = router;