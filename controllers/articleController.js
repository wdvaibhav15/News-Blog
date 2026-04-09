const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const fs = require('fs');
const path = require('path');
const createError = require('../utils/error-message');
const { validationResult } = require('express-validator');

const allArticles = async (req, res, next) => {
    try {
        let articles;
        if (req.role === "admin") {
            articles = await newsModel.find()
                .populate('category', "name")
                .populate('author', "fullname");
        } else {
            articles = await newsModel.find({ author: req.id })
                .populate('category', "name")
                .populate('author', "fullname");
        }
        res.render("admin/articles/index", { role: req.role, articles });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const addArticlePage = async (req, res) => {
    const categories = await categoryModel.find({});
    res.render("admin/articles/create", { role: req.role, categories, errors: 0 });
};

const addArticle = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const categories = await categoryModel.find({});
        return res.render("admin/articles/create", {
            role: req.role,
            categories,
            errors: errors.array()
        });
    }

    try {
        const { title, content, category } = req.body;

        const mainImage =
            req.files && req.files.image && req.files.image.length > 0
                ? req.files.image[0].filename
                : null;

        const article = new newsModel({
            title,
            content,
            category,
            author: req.id,
            image: mainImage
        });

        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        console.log('addArticle error:', error);
        next(error);
    }
};

const updateArticlePage = async (req, res, next) => {
    const id = req.params.id;
    try {
        const article = await newsModel.findById(id)
            .populate('category', "name")
            .populate('author', "fullname");

        if (!article) {
            return next(createError('Article not found', 404));
        }

        if (req.role === "author") {
            if (req.id !== article.author._id.toString()) {
                return res.status(401).send('Unauthorized');
            }
        }

        const categories = await categoryModel.find();
        res.render("admin/articles/update", { role: req.role, article, categories, errors: 0 });
    } catch (error) {
        console.log('updateArticlePage error:', error);
        next(error);
    }
};

const updateArticle = async (req, res, next) => {
    const id = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const categories = await categoryModel.find({});
        return res.render("admin/articles/update", {
            role: req.role,
            article: req.body,
            categories,
            errors: errors.array()
        });
    }

    try {
        const { title, content, category } = req.body;
        const article = await newsModel.findById(id);

        if (!article) {
            return next(createError('Article not found', 404));
        }

        if (req.role === "author") {
            if (req.id !== article.author.toString()) {
                return res.status(401).send('Unauthorized');
            }
        }

        article.title = title;
        article.content = content;
        article.category = category;

        if (req.files && req.files.image && req.files.image.length > 0) {
            const oldImagePath = path.join(__dirname, '../public/images', article.image);

            if (article.image && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            article.image = req.files.image[0].filename;
        }

        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        console.log('updateArticle error:', error);
        next(error);
    }
};

const deleteArticle = async (req, res, next) => {
    const id = req.params.id;
    try {
        const article = await newsModel.findById(id);
        if (!article) {
            return next(createError('Article not found', 404));
        }

        if (req.role === "author") {
            if (req.id !== article.author._id.toString()) {
                return res.status(401).send('Unauthorized');
            }
        }

        try {
            const oldImagePath = path.join(__dirname, '../public/images', article.image);
            if (article.image && fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        } catch (error) {
            console.log('Error deleting old image:', error);
            next(error);
        }

        await article.deleteOne();
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    allArticles,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    deleteArticle
};