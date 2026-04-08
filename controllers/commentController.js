const commentModel = require('../models/Comment');
const createError = require('../utils/error-message');
const { validationResult } = require('express-validator');
const newsModel = require('../models/News');

const allComments = async (req, res) => {
    try {
        let comments;
        if(req.role === "admin"){
            comments = await commentModel.find()
                                           .populate('article', 'title')
                                           .sort({ createdAt: -1 });
        } else{
            const news = await newsModel.find({author: req.id});
            const newsIds = news.map(news => news._id);
            comments = await commentModel.find({ article: { $in: newsIds } })
                                           .populate('article', 'title')
                                           .sort({ createdAt: -1 });
        }
        
        // res.json(comments);
         res.render("admin/comments/index", {comments, role:req.role});
    } catch (error) {
        console.log("allComments error:", error);
        res.status(500).send("Server Error");
    }
}

const updateCommentStatus = async (req, res) => {
    try {
        const comment = await commentModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).send("Comment status updated successfully");
    } catch (error) {
        console.log("updateCommentStatus error:", error);
        res.status(500).send("Server Error");
    }
}

const deleteComment = async (req, res) => {
    try {
        const comment = await commentModel.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        res.status(200).send("Comment deleted successfully");
    } catch (error) {
        console.log("deleteComment error:", error);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    allComments,
    updateCommentStatus,
    deleteComment

}