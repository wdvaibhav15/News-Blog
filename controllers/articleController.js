const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');

const allArticles = async (req, res) => {
    try {
        let articles;
        if(req.role === "admin"){
         articles = await newsModel.find()
                                .populate('category',"name")
                                .populate('author',"fullname");
        }else{
         articles = await newsModel.find({author: req.id})
                                .populate('category',"name")
                                .populate('author',"fullname");
        }
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
    const id = req.params.id;
    try {
        const article = await newsModel.findById(id)
                            .populate('category',"name")
                            .populate('author',"fullname");
        if (!article) {
            return res.status(404).send('Article not found');
        }

        if(req.role === "author"){
            if(req.id !== article.author._id.toString()){
                return res.status(401).send('Unauthorized');
            }    
        }

        const categories = await categoryModel.find();
        res.render("admin/articles/update",{role:req.role, article, categories});
    } catch (error) {
        console.log('updateArticlePage error:', error);
        res.status(500).send('Server Error');
    }
};

const updateArticle = async (req, res) => {
    const id = req.params.id;
    try {
        const { title, content , category } = req.body;
        const article = await newsModel.findById(id);
        if (!article) {
            return res.status(404).send('Article not found');
        }

         if(req.role === "author"){
            if(req.id !== article.author._id.toString()){
                return res.status(401).send('Unauthorized');
            }    
        }

        article.title = title;
        article.content = content;
        article.category = category;
        if (req.file) {
            article.image = req.file.filename;
        }
        await article.save();
        res.redirect('/admin/article');
    } catch (error) {
        console.log('updateArticle error:', error);
        res.status(500).send('Server Error');
    }
};

const deleteArticle = async (req, res) => {
    const id = req.params.id;
    try {
        const article = await newsModel.findById(id);    
        if (!article) {
            return res.status(404).send('Article not found');
        }

         if(req.role === "author"){
            if(req.id !== article.author._id.toString()){
                return res.status(401).send('Unauthorized');
            }    
        }
        await article.deleteOne();
        res.json({success: true});
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