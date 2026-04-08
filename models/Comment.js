const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, {  
    timestamps: true 
});

module.exports = mongoose.model('Comment', commentSchema);
