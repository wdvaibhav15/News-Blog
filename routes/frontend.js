const express = require('express');
const router = express.Router();

// const {
//     index,
//     articleByCategories,
//     singleArticle,
//     search, 
//     author,
//     addComment
// } = require('../controllers/siteController');

const siteController = require('../controllers/siteController');
const loadCommonData = require('../middleware/loadCommonData');

router.use(loadCommonData);

router.get("/", siteController.index);
router.get("/category/:name", siteController.articleByCategories);
router.get("/single/:id", siteController.singleArticle);
router.get("/search", siteController.search);
router.get("/author/:id", siteController.author);
router.post("/single/:id/comment", siteController.addComment);

// 404 Middleware
router.use((req, res, next) => {
    res.status(404).render("404", {
        message: "404 Not Found"
    });
});

// 500 Middleware
router.use((err, req, res, next) => {
    console.error(err.stack); 
    const status = err.status || 500;



    res.status(status).render("errors", {
        message: err.message || "something went wrong",
        status
    });
});


module.exports = router;
