const express = require('express');
const router = express.Router();
const { membersDb, accountsDb, adminsDb } = require('../config/db')

router.get("/",(req,res)=>{
    const sql = `SELECT * FROM member_accounts`;
    accountsDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 500,
                "response" : "Internal Server Error"
            })
        }
        res.status(200).send({
            "status_code"  :200,
            "response" : result
        })
    })
})

module.exports = router;