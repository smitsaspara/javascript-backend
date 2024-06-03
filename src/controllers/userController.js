import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req,res) => {

    const { fullname, email, password, username } = req.body;

    if (
        [fullname, email, password, username].some(
            (field)=>{
                field?.trim() === ""})
    ) { 
        throw new ApiError(404, "All fields are required") 
    }

    const existingUser = User.findOne({
        $or : [ { username } , { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "A user with the same username or email is already exist!");    
    }

    const avatarLocalPath = req.files?.avatar[0].path;

    const coverImageLocalPath = req.files?.coverImage[0].path;

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

    const createdUser = User.findById(user._id).select("-passoword -refreshToken");

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong");        
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser, "user registerred successfully" )
    )



})

export { registerUser };