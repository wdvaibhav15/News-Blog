const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');

const allArticles = async (req, res) => {
    try {
        const articles = await newsModel.find()
                                .populate('category',"name")
                                .populate('author',"fullname");
        res.render("admin/articles/index",{role:req.role, articles});
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went wrong");
    }
};

const addArticlePage = async (req, res) => {
    const categories = await categoryModel.find({});
    res.render("admin/articles/create",{role:req.role, categories});
};


const addArticle = async (req, res) => {
    
    try {
        const { title, content , category } = req.body;
        const article = new newsModel({
            title,
            content,
            category,
            author: req.id,
            image: req.file.filename
        });
        
        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        console.log('addArticle error:', error);
        res.status(500).send('Server Error');
    }
};

const updateArticlePage = async (req, res) => {
    res.render("admin/articles/update",{role:req.role});
};

const updateArticle = async (req, res) => {};
const deleteArticle = async (req, res) => {};

module.exports = {
    allArticles,
    addArticlePage,
    addArticle,
    updateArticlePage,
    updateArticle,
    deleteArticle
};