const express = require('express');
const router = express.Router();
const {membersDb,accountsDb,adminsDb} = require('../config/db')

router.post("/",(req,res)=>{
    const details = req.body;

    const sql = `INSERT INTO payments (bill_amount,mem_email) VALUES(?,?)`
    adminsDb.query(sql,[details.amount,details.email],(err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : "Succcess"
        })
    })
})

module.exports = router;