import { Router } from "express";
import { logOutUser, loginUser, registerUser,refreshAccessToken, changePassword, getUser, updateUserDetails, updateAvatar, updateCoverImage, userProfile, getWatchHistory } from "../controllers/userController.js";
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

router.route("/changePassword").post(varifyJWT, changePassword)

router.route("/currentUser").get(varifyJWT, getUser)

router.route("/updateAccount").patch(varifyJWT, updateUserDetails)

router.route("/avatar").patch(varifyJWT, upload.single("avatar"), updateAvatar)

router.route("/coverImage").patch(varifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/channel/:username").get(varifyJWT, userProfile )

router.route("/history").get(varifyJWT, getWatchHistory)

export default router;