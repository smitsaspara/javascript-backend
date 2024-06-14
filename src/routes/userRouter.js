import { Router } from "express";
import { logOutUser, loginUser, registerUser,refreshAccessToken } from "../controllers/userController.js";
import { upload } from "../middlewares/multerMiddleWare.js";
import { varifyJWT } from "../middlewares/authMiddleWare.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name : "avatar", 
        maxCount : 1
    },
    {
        name : "coverImage", 
        maxCount : 1
    }]),
    registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(varifyJWT,logOutUser);

router.route("/accessToken").post(refreshAccessToken);

export default router;