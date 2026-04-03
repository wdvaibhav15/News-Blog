const express = require('express');
const router = express.Router();

// const {
//     loginPage,
//     adminLogin,
//     logout} = require('../controllers/admin/loginController');

// const {
//     allUser,
//     addUserPage,
//     addUser,
//     updateUserPage,
//     updateUser,
//     deleteUser} = require('../controllers/admin/userController');

// const {
//     allCategory,
//     addCategoryPage,
//     addCategory,
//     updateCategoryPage,
//     updateCategory,
//     deleteCategory} = require('../controllers/admin/categoryController');

// const {
//     allArticles,
//     addArticlePage,
//     addArticle,
//     updateArticlePage,
//     updateArticle,
//     deleteArticle} = require('../controllers/admin/articleController');

// const {
//     allComments} = require('../controllers/admin/commentController');

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

//login Routes
router.get("/", userController.loginPage());
router.post("/index", userController.adminLogin());
router.get("/logout", userController.logout());

//user CRUD Routes
router.get("/users", userController.allUser());
router.get("/add-user", userController.addUserPage());
router.post("/add-user", userController.addUser());
router.get("/update-user/:id", userController.updateUserPage());
router.post("/update-user/:id", userController.updateUser());
router.get("/delete-user/:id", userController.deleteUser());

//category CRUD Routes
router.get("/category", categoryController.allCategory());
router.get("/add-category", categoryController.addCategoryPage());
router.post("/add-category", categoryController.addCategory());
router.get("/update-category/:id", categoryController.updateCategoryPage());
router.post("/update-category/:id", categoryController.updateCategory());
router.get("/delete-category/:id", categoryController.deleteCategory());

//Article CRUD Routes
router.get("/articles", articleController.allArticles());
router.get("/add-article", articleController.addArticlePage());
router.post("/add-article", articleController.addArticle());
router.get("/update-article/:id", articleController.updateArticlePage());
router.post("/update-article/:id", articleController.updateArticle());
router.get("/delete-article/:id", articleController.deleteArticle());

//comment Routes
router.get("/comments", commentController.allComments());

module.exports = router;
