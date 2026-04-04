const commentModel = require('../models/Comment');

const allComments = async (req, res) => {
    res.render("admin/comments/index", {role:req.role});
}

module.exports = {
    allComments
}