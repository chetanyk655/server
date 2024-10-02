const express = require('express');
const router = express.Router();
const {membersDb,accountsDb,adminsDb} = require('../config/db')

router.post("/",(req,res)=>{
    const details = req.body;

    const sql = `INSERT INTO bills (bill_amount,m_email,name,type,file_data) VALUES(?,?,?,?,?)`
    adminsDb.query(sql,[details.amount,details.m_email,details.name,details.type,details.file_data],(err,result)=>{
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

router.post("/maintenance",(req,res)=>{
    const {bid,amount,email} = req.body;

    const sql = `INSERT INTO maintenance (bill_id,amount,m_email) VALUES (?,?,?)`;
    adminsDb.query(sql,[bid,amount,email],(err,result)=>{
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
            "response" : "Succcess"
        })
    });
    
})

router.post("/paydone",(req,res)=>{
    const {bid} = req.body;

    const sql = `UPDATE maintenance SET pay_status = "Paid"  WHERE bill_id ="${bid}"`;
    adminsDb.query(sql,(err,result)=>{
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
            "response" : "Succcess paydone"
        })
    });
    
})

router.delete("/",(req,res)=>{
    const {email} = req.body;
    
    const sql = `DELETE FROM  bills WHERE m_email = "${email}"`;
    adminsDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code"  : 500,
                "response" : "Internal Server Error"
            })
            return;

        }
        if (result.affectedRows === 0) {
             res.status(404).send({
                "status_code": 404,
                "response": "No record found to delete"
            });
            return;
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : "Successfully deleted"
        })
    })
})

router.get("/",(req,res)=>{
    const email = req.query.email;

    const sql = `SELECT * FROM bills WHERE m_email = ?`;
    
    adminsDb.query(sql,[email],(err,result)=>{
        console.log(result)
        if(err){
            console.log(err);
            return;
        }

        if(result.length == 0){
            res.status(404).send({
                "status_code" : 404,
                "response" : "No Bills on due."
            })
            return result;
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })
    })
})

module.exports = router;