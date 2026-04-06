const mongoose = require('mongoose');

const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');
const settingModle = require('../models/Setting');

const index = async (req, res) => {
    try {
        const news = await newsModel.find()
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname')
            .sort({ createdAt: -1 });
         
        res.render("index", { news });
    } catch (error) {
        console.log("index error:", error);
        res.status(500).send("Server Error");
    }
};

const articleByCategories = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.name });

        if (!category) {
            return res.status(404).send("Category not found");
        }

        const news = await newsModel.find({ category: category._id })
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname')
            .sort({ createdAt: -1 });

       
        res.render("category", { news, category });
    } catch (error) {
        console.log("articleByCategories error:", error);
        res.status(500).send("Server Error");
    }
};

const singleArticle = async (req, res) => {
    try {
        const singleNews = await newsModel.findById(req.params.id)
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname');

        if (!singleNews) {
            return res.status(404).send("Article not found");
        }

        const latestNews = await newsModel.find()
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname')
            .sort({ createdAt: -1 })
            .limit(5);

        

        res.render("single", { singleNews });
    } catch (error) {
        console.log("singleArticle error:", error);
        res.status(500).send("Server Error");
    }
};

const search = async (req, res) => {
    try {
        const searchQuery = req.query.search || "";

        const news = await newsModel.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        })
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname')
            .sort({ createdAt: -1 });

        

        res.render("search", { news, searchQuery });
    } catch (error) {
        console.log("search error:", error);
        res.status(500).send("Server Error");
    }
};

const author = async (req, res) => {
    try {
        const author = await userModel.findById(req.params.id);

        if (!author) {
            return res.status(404).send("Author not found");
        }

        const news = await newsModel.find({ author: req.params.id })
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname')
            .sort({ createdAt: -1 });

        

        res.render("author", { news, author });
    } catch (error) {
        console.log("author error:", error);
        res.status(500).send("Server Error");
    }
};

const addComment = async (req, res) => {
    try {
        res.send("Add comment route working");
    } catch (error) {
        console.log("addComment error:", error);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    index,
    articleByCategories,
    singleArticle,
    search,
    author,
    addComment
};