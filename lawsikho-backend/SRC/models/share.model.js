import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({

    toUser: { 
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true, 
        trim: true,
    },
    fromUser: { 
        type: mongoose.Schema.Types.ObjectId ,
        ref: 'User',
        required: true, 
        trim: true,
    },
    noteId:{
         type: mongoose.Schema.Types.ObjectId ,
        ref: 'Note',
        required: true, 
        trim: true,
    },
     permission: { 
                type: String,
                 enum: ['read', 'write'],
                 default: 'read' 
                },


}, { timestamps: true })

export default mongoose.model('Share', shareSchema)

