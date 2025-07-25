import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({

    loginUser: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                trim: true,
            },
            userCount: {
                type: Number,
                default: 0
            }
        }

    ],
    
    tags: [
        {
            tagName: {
                type: String,
            },
            tagCount: {
                type: Number,
                default: 0
            }
        }
    ],

}, { timestamps: true })

export default mongoose.model('Record', recordSchema)

