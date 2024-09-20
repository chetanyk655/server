const express = require("express")

const app = express();
app.use(express.json());

app.use(express.urlencoded({
    extended : true
}));

let details = {};
app.listen(2000,()=>{
    console.log("hello buddies");
})

app.post("/api/send",(req,res)=>{
    console.log("Results",req.body);
    details = {
        "name" : req.body.name,
        "city" : req.body.city,
        "state" : req.body.state
    }

    console.log("final result",details);
    res.status(200).send({
        "status_code" : 200,
        "message" : "Details are added",
        "details" : details
    })
})


