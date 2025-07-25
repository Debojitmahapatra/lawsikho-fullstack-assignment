import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
 
    title: {
        type: String,
        required:true,
    },
    content: {
        type: String,
    },
    tags: [String],

    isArchived: { 
        type: Boolean,
        default:false,
     },
    owner: { 
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true, 
        trim: true,
    },
}, { timestamps: true })

export default mongoose.model('Note', noteSchema)

