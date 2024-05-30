
const express  = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose")

//app.use('dotenv');

dotenv.config();
mongoose.connect("mongodb://127.0.0.1:27017/practice").then(console.log("connected")).catch(console.error());

const port = process.env.PORT || 1234 ;

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.get("/login", (req, res) => {
    res.send("Login");
})

app.get("/twitter", (req, res) => {
    res.send("smit");
})

app.get("/smit", (req, res) => {
    res.send("Hello Smit");
})


app.listen(port, () =>{
    console.log(`working on "http://localhost:${port}"`)
} )