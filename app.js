const express = require("express");

const bodyParser = require("body-parser");

const client = require("@mailchimp/mailchimp_marketing");

const app = express();

const port = 3000;


var dirname = __dirname;
app.use(express.static("public"));//folder with static local files

app.use(bodyParser.urlencoded({extended: true})); //for post 

app.get("/", (req, res)=>{
    res.sendFile(dirname+"/signup.html");
});


app.post("/success", (req, res)=>{
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    }

    //convert to json
    const jsonData = JSON.stringify(data);

    //Authentication, API    
    client.setConfig({
        apiKey: "75c9d1ccd513564f1a27d3cdc222ff09-us21",
        server: "us21"
    });

    //Asyn function send data to the list via batchlistmembers
    const run = async()=>{
      
        const response = await client.lists.batchListMembers("70c3b83a37", jsonData);
        
        
    };


    //run async function
    run().then(
        (f)=>{
            console.log("sucess!");
            console.log("ESTADO ES:"+f);
            res.sendFile(dirname+"/success.html");
        },
        (r)=>{
            console.log("failed");
            console.log("ESTADO ES:"+r);
            res.sendFile(dirname+"/failure.html");
        }
    );


    console.log();
    
});


app.post("/failure", (req, res)=>{
    res.redirect("/"); //do a redirection
});
app.listen(port, (req, res)=>{
    console.log(`Server is running on port: ${port}`);
});


//75c9d1ccd513564f1a27d3cdc222ff09-us21

//audience id: 70c3b83a37

//serverprefix: us21