import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { loadEnvFile } from "process";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async (localPath) => {
    try {

        if(!localPath) return null;

        const upload = await cloudinary.uploader.upload(localPath, {
            resource_type : "auto",
        })
        
        console.log("uploaded successfully on:", upload.url);

        return upload;
    } catch (error) {
        
        //remove the locally saved file in case of operation failed
        fs.unlinkSync(localPath);

        return null;
    }
}

export { uploadOnCloudinary };