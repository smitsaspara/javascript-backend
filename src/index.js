import dotenv from "dotenv";
import dbConnect from "./dbConnect/index.js";
import { app } from "./app.js";
dotenv.config({
    path: "./emvß"
});

dbConnect().then(()=>{
    app.listen(process.env.PORT || 1234, () => {
        console.log(`app running on http://localhost:${process.env.PORT} `)
    })
}).catch((error) => {   
    console.log("mongodb connection fail", error);
});
