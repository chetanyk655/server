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
            "response" : "Succcess",
            "bill_id" : result['b_id'],
        })
    })
})

router.post("/maintenance",(req,res)=>{
    const {bid,amount,email,pay_status} = req.body;

    const sql = `INSERT INTO maintenance (bill_id,amount,m_email,pay_status) VALUES (?,?,?,?)`;
    adminsDb.query(sql,[bid,amount,email,pay_status],(err,result)=>{
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
    console.log(email)
    const sql = `SELECT * FROM bills WHERE m_email = "${email}"`;
    
    adminsDb.query(sql,(err,result)=>{
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
            "response" : result[result.length-1]
        })
    })
})

router.get("/allbills",(req,res)=>{


    const sql = `SELECT * FROM maintenance `;
    adminsDb.query(sql,(err,result)=>{
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