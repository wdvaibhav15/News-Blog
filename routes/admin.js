const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');
const upload = require("../middleware/multer");

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

// login Routes
router.get("/", userController.loginPage);
router.post("/index", userController.adminLogin);
router.get("/logout", userController.logout);

// dashboard Route
router.get("/dashboard", isLoggedIn,userController.dashboard);

// settings Route
router.get("/setting",isLoggedIn,isAdmin, userController.setting);

// user CRUD Routes
router.get("/users",isLoggedIn,isAdmin, userController.allUser);
router.get("/add-user",isLoggedIn,isAdmin, userController.addUserPage);
router.post("/add-user",isLoggedIn,isAdmin, userController.addUser);
router.get("/update-user/:id", isLoggedIn,isAdmin, userController.updateUserPage);
router.post("/update-user/:id", isLoggedIn,isAdmin, userController.updateUser);
router.delete("/delete-user/:id", isLoggedIn,isAdmin, userController.deleteUser);

// category CRUD Routes
router.get("/category", isLoggedIn, isAdmin, categoryController.allCategory);
router.get("/add-category", isLoggedIn, isAdmin, categoryController.addCategoryPage);
router.post("/add-category", isLoggedIn, isAdmin, categoryController.addCategory);
router.get("/update-category/:id", isLoggedIn, isAdmin, categoryController.updateCategoryPage);
router.post("/update-category/:id", isLoggedIn, isAdmin, categoryController.updateCategory);
router.delete("/delete-category/:id", isLoggedIn, isAdmin, categoryController.deleteCategory);

// article CRUD Routes
router.get("/article",isLoggedIn, articleController.allArticles);
router.get("/add-article", isLoggedIn, articleController.addArticlePage);
router.post("/add-article", upload.single("image"), isLoggedIn, articleController.addArticle);
router.get("/update-article/:id", isLoggedIn, articleController.updateArticlePage);
router.post("/update-article/:id", upload.single("image"), isLoggedIn, articleController.updateArticle);
router.delete("/delete-article/:id", isLoggedIn, articleController.deleteArticle);

// comment Routes
router.get("/comments", isLoggedIn, commentController.allComments);

module.exports = router;