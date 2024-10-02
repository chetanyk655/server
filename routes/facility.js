const { membersDb, accountsDb, adminsDb } = require('../config/db')
const express = require('express');
const router = express.Router();

router.post("/",(req,res)=>{
    try{
    const details = req.body;
    const sql = `INSERT INTO facility (e_name,e_date,e_time,e_desc,usr_mail) VALUES (?,?,?,?,?)`;

    membersDb.query(sql,[details.name,details.date,details.time,details.desc,details.user_mail],(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 200,
                "response" : "Internal Server error"
            })
            return;
        }

        res.status(200).send({
            "status_code" : 200,
            "Response" : "Success"
        })
    });
    }catch(e){
        console.err(e);
    }
});

router.get("/singleFacility",(req,res)=>{
    const sql = `SELECT * FROM facility WHERE usr_mail = "${req.query.email}"`;
    membersDb.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send({
                "status_code" : 500,
                "reponse" : "Internal server error"
            });
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })
    })

})

router.get("/",(req,res)=>{
    const sql = `SELECT * FROM facility`;
    membersDb.query(sql,(err,result)=>{
        if(err){
            console.err(err);
            res.status(500).send({
                "status_code" : 500,
                "reponse" : "Internal server error"
            });
        }
        res.status(200).send({
            "status_code" : 200,
            "response" : result
        })
    })

})

module.exports = router;
