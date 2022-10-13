import express, { application } from 'express'
const SERVER_PORT=5000;


const app = express();
app.get('/', (req, res)=>{
    res.send("Hello Sofia");
});

app.listen(SERVER_PORT, (err)=>{
    if(!err){
        console.log("Server is running at the port ", SERVER_PORT);
    }
});