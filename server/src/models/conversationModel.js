import mongoose from 'mongoose';
import User from './userModel.js';
import Message from './messageModel.js';

const conversationSchema=new mongoose.Schema({
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],

    messages:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message',
            default:[]
        }
    ]
},{ timestamps:true })

export default mongoose.model('Conversation',conversationSchema);