const mongoose = require('mongoose');

const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');
const settingModle = require('../models/Setting');
const paginate = require('../utils/paginate');
const createError = require('../utils/error-message');


const index = async (req, res, next) => {
    try {
        // const news = await newsModel.find()
        //     .populate('category', { name: 1, slug: 1 })
        //     .populate('author', 'fullname')
        //     .sort({ createdAt: -1 });
        const paginatedNews = await paginate(newsModel, {}, 
                               req.query, {
                               populate: [
                               { path: 'category', select: 'name slug' },
                               { path: 'author', select: 'fullname' },
                               ],
                               sort: { createdAt: -1 },
        });
        // res.json(paginatedNews);
         res.render("index", { paginatedNews, query: req.query });
    } catch (error) {
        console.log("index error:", error);
        res.status(500).send("Server Error");
    }
};

 const articleByCategories = async (req, res, next) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.name });

        if (!category) {
            
            return next(createError('Category not found', 404));
        }

        // const news = await newsModel.find({ category: category._id })
        //     .populate('category', { name: 1, slug: 1 })
        //     .populate('author', 'fullname')
        //     .sort({ createdAt: -1 });
        const paginatedNews = await paginate(newsModel, {category: category._id}, 
                               req.query, {
                               populate: [
                               { path: 'category', select: 'name slug' },
                               { path: 'author', select: 'fullname' },
                               ],
                               sort: { createdAt: -1 },
        });

       
        res.render("category", { paginatedNews, category, query: req.query });
    } catch (error) {
        console.log("articleByCategories error:", error);
        res.status(500).send("Server Error");
    }
};

 const singleArticle = async (req, res, next) => {
    try {
        const singleNews = await newsModel.findById(req.params.id)
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname');

        if (!singleNews) {
            return next(createError('Article not found', 404));
        }

        const latestNews = await newsModel.find()
            .populate('category', { name: 1, slug: 1 })
            .populate('author', 'fullname')
            .sort({ createdAt: -1 })
            .limit(5);

        
        // get all the comments for this article
        const comments = await commentModel.find({ article: req.params.id, status: "approved" })
             .sort({ createdAt: -1 });
        //res.json({singleNews, comments});
        res.render("single", { singleNews, comments });
    } catch (error) {
        console.log("singleArticle error:", error);
        res.status(500).send("Server Error");
    }
};

const search = async (req, res) => {
    try {
        const searchQuery = req.query.search || "";

        // const news = await newsModel.find({
        //     $or: [
        //         { title: { $regex: searchQuery, $options: 'i' } },
        //         { content: { $regex: searchQuery, $options: 'i' } }
        //     ]
        // })
        //     .populate('category', { name: 1, slug: 1 })
        //     .populate('author', 'fullname')
        //     .sort({ createdAt: -1 });
        const paginatedNews = await paginate(newsModel, {
                         $or: [
                             { title: { $regex: searchQuery, $options: 'i' } },
                             { content: { $regex: searchQuery, $options: 'i' } }
                     ]
                    }, 
                       req.query, {
                       populate: [
                       { path: 'category', select: 'name slug' },
                       { path: 'author', select: 'fullname' },
                       ],
                       sort: { createdAt: -1 },
                   });

        

        res.render("search", { paginatedNews , searchQuery, query: req.query });
    } catch (error) {
        console.log("search error:", error);
        res.status(500).send("Server Error");
    }
};

const author = async (req, res) => {
    try {
        const author = await userModel.findById(req.params.id);

        if (!author) {
             return next(createError('Author not found', 404));
        }

        // const news = await newsModel.find({ author: req.params.id })
        //     .populate('category', { name: 1, slug: 1 })
        //     .populate('author', 'fullname')
        //     .sort({ createdAt: -1 });
        const paginatedNews = await paginate(newsModel, {author: req.params.id}, 
                               req.query, {
                               populate: [
                               { path: 'category', select: 'name slug' },
                               { path: 'author', select: 'fullname' },
                               ],
                               sort: { createdAt: -1 },
        });

        

        res.render("author", { paginatedNews, author, query: req.query });
    } catch (error) {
        console.log("author error:", error);
        res.status(500).send("Server Error");
    }
};

const addComment = async (req, res) => {
    try {
        const { name, email, content } = req.body;
        const comment = new commentModel({
            name,
            email,
            content,
            article: req.params.id
        });
        await comment.save();
        res.redirect(`/single/${req.params.id}`);
    } catch (error) {
        
         return next(createError('addComment error', 500));
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