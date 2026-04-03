const commentModel = require('../models/Comment');

const allComments = async (req, res) => {
    res.render("admin/comments/index");
}

module.exports = {
    allComments
}