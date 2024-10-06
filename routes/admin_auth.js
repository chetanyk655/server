const express = require('express');
const router = express.Router();

router.post('/',(req,res)=>{
    const {key} = req.body;
    if(key == process.env.SECRET_KEY){
        res.status(200).send({
            "canAuth"  :true,
        })
    }else{
        res.status(501).send({
            "canAuth" : false
        })
    }
})

module.exports = router;