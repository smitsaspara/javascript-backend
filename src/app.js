import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.use(cookieParser());

//import routes
import userRouter from './routes/userRouter.js'

//declaration
app.use('/api/v1/users', userRouter);


export { app };