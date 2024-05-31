import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        require : true
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description : {
        type: String,
        require : true,
    },
    duration : {
        type: Number,
        require : true
    },
    views: {
        type : Number,
        default : 0
    },
    isPublished: {
        type : Boolean,
        default : 0
    },
    owner: {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
    },
    { 
        timestamps: true 
    }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Model = mongoose.Model("Model", videoSchema);