const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');
const upload = require("../middleware/multer");
const isValid = require("../middleware/validation");

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

// login Routes
router.get("/", userController.loginPage);
router.post("/index",isValid.loginValidation, userController.adminLogin);
router.get("/logout", userController.logout);

// dashboard Route
router.get("/dashboard", isLoggedIn,userController.dashboard);

// settings Route
router.get("/settings",isLoggedIn,isAdmin, userController.settings);
router.post("/save-settings",isLoggedIn,isAdmin, upload.single("website_logo"), userController.saveSettings);

// user CRUD Routes
router.get("/users",isLoggedIn,isAdmin, userController.allUser);
router.get("/add-user",isLoggedIn,isAdmin, userController.addUserPage);
router.post("/add-user",isLoggedIn,isAdmin,isValid.UserValidation, userController.addUser);
router.get("/update-user/:id", isLoggedIn,isAdmin, userController.updateUserPage);
router.post("/update-user/:id", isLoggedIn,isAdmin, isValid.UserUpdateValidation, userController.updateUser);
router.delete("/delete-user/:id", isLoggedIn,isAdmin, userController.deleteUser);

// category CRUD Routes
router.get("/category", isLoggedIn, isAdmin, categoryController.allCategory);
router.get("/add-category", isLoggedIn, isAdmin, categoryController.addCategoryPage);
router.post("/add-category", isLoggedIn, isValid.CategoryValidation, isAdmin, categoryController.addCategory);
router.get("/update-category/:id", isLoggedIn, isAdmin, categoryController.updateCategoryPage);
router.post("/update-category/:id", isLoggedIn, isValid.CategoryValidation, isAdmin, categoryController.updateCategory);
router.delete("/delete-category/:id", isLoggedIn, isAdmin, categoryController.deleteCategory);

// article CRUD Routes
router.get("/article",isLoggedIn, articleController.allArticles);
router.get("/add-article", isLoggedIn, articleController.addArticlePage);
router.post("/add-article", upload.single("image"), isLoggedIn, isValid.ArticleValidation, articleController.addArticle);
router.get("/update-article/:id", isLoggedIn, articleController.updateArticlePage);
router.post("/update-article/:id", upload.single("image"), isLoggedIn, isValid.ArticleValidation, articleController.updateArticle);
router.delete("/delete-article/:id", isLoggedIn, articleController.deleteArticle);

// comment Routes
router.get("/comments", isLoggedIn, commentController.allComments);
router.put("/update-comment-status/:id", isLoggedIn, commentController.updateCommentStatus);
router.delete("/delete-comment/:id", isLoggedIn, commentController.deleteComment);

//404 Middleware
router.use(isLoggedIn,(req, res, next) => {
    res.status(404).render("admin/404", {
        message: "404 Not Found",
        role: req.role
    });
});

//500 Middleware
router.use(isLoggedIn,(err, req, res, next) => {
    console.error(err.stack); 
    const status = err.status || 500;
    const view = status === 404 ? "admin/404" : "admin/500";   
    res.status(status).render(view, {
        message: err.message || "something went wrong",
        role: req.role
    });
});



module.exports = router;