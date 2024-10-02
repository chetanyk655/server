const express = require('express');
const router = express.Router();
const { membersDb, accountsDb, adminsDb } = require('../config/db')

router.post("/",(req,res)=>{
    const contact = req.body;

    const sql = `INSERT INTO contacts (con_name,con_no,uploader_mail) VALUES (?,?,?)`;
    accountsDb.query(sql,[contact.name,contact.ph,contact.uploader],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code"  :500,
                "response"  : "Internal Server Error"
            })
        }

        res.status(200).send({
            "status_code"  :200,
            "response" : "Success"
        })
    })
});

router.get("/",(req,res)=>{
    const sql = `SELECT * FROM contacts`;
    accountsDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code"  : 500,
                "repsonse"  :"Internal Server Error"
            })
        }

        res.status(200).send({
            "status_code"  :200,
            "response"  :result
        })
    })
});

router.delete("/", (req, res) => {
    const { contact} = req.body; // Assume you're sending the ID in the request body

    const sql = `DELETE FROM contacts WHERE con_no = ?`; // Adjust based on your schema

    accountsDb.query(sql, [contact], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({
                "status_code": 500,
                "response": "Internal Server error"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send({
                "status_code": 404,
                "response": "No record found to delete"
            });
        }

        res.status(200).send({
            "status_code": 200,
            "response": "Record deleted successfully"
        });
    });
});

module.exports = router;