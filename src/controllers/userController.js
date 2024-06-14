import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
    try {

        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave : false});

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500 , "unable to generate refresh and access token");
    }
}

const registerUser = asyncHandler( async (req,res) => {

    const { fullname, email, password, username } = req.body;

    if (
        [fullname, email, password, username].some(
            (field)=>{
                field?.trim() === ""})
    ) { 
        throw new ApiError(404, "All fields are required") 
    }

    const existingUser = await User.findOne({
        $or : [ { username } , { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "A user with the same username or email is already exist!");    
    }

    console.log("----> " + req.files?.avatar[0].path);

    const avatarLocalPath = req.files?.avatar[0].path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");      
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        password,
        email,
        username : username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select("-passoword -refreshToken");

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong");        
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "user registerred successfully" )
    )

})


const loginUser = asyncHandler( async(req, res) =>{

    const { username , email , password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email required");
    }

    const findUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if (!findUser) {
        throw new ApiError(404, "User does not exist!");
    }

    const passwordValidation = await findUser.isPasswordCorrect(password);

    if (!passwordValidation) {
        throw new ApiError(404, "Invalid Password!");
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshToken(findUser._id);

    const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken");

    const option = {
        httpOnly: true,
        secure : true
    }

    return res.
    status(200).
    cookie("accessToken", accessToken, option).
    cookie("refreshToken", refreshToken, option).
    json(
        new ApiResponse(
            200 ,
            { user : loggedInUser, accessToken, refreshToken },
            "User Logged In Successfully"
    ))

})


const logOutUser = asyncHandler( async(req, res) => {
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set :{
                refreshToken : undefined,
            }
        },
        {
            new: true,
        }
    )

    const option = {
        httpOnly: true,
        secure : true
    }

    return res.
    status(200).
    clearCookie("accessToken", option).
    clearCookie("refreshToken", option).
    json(
        new ApiResponse(
            200 ,
            {},
            "User Logged Out Successfully"
    ))

})


const refreshAccessToken = asyncHandler( async(req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

   try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
 
        const user = await User.findById(decodedToken._id);
 
        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }
 
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token expired");
        }
 
        const {accessToken, newRefreshToken}  = await user.generateAccessAndRefreshToken(user._id);
 
        const options =  {
            httpOnly : true,
            secure : true
        } 
 
        return res.status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", newRefreshToken, options).
        json(new ApiResponse(200, {accessToken, newRefreshToken}, "token refreshed"))

    }
    catch (error) {
        throw new ApiError(401, "Invalid refresh token")
   }

})

export { 
    registerUser,
    loginUser, 
    logOutUser, 
    refreshAccessToken
};