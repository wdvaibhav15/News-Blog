const { body } = require("express-validator");

const loginValidation = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .matches(/^\S+$/)
        .withMessage("Username is required and cannot contain spaces")
        .isLength({ min: 5 , max: 12 })
        .withMessage("Username must be 5 to 12 characters long"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 5, max: 12 })
        .withMessage("Password must be between 5 and 12 characters long")
];

const UserValidation = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("FullName is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("FullName must be between 5 and 20 characters long"),

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .matches(/^\S+$/)
        .withMessage("Username is required and cannot contain spaces")
        .isLength({ min: 5 , max: 12 })
        .withMessage("Username must be 5 to 12 characters long"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 5, max: 12 })
        .withMessage("Password must be between 5 and 12 characters long"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["author", "admin"])
        .withMessage("Role must be either 'author' or 'admin'")
];

const UserUpdateValidation = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("FullName is required")
        .isLength({ min: 5, max: 20 })
        .withMessage("FullName must be between 5 and 20 characters long"),

    body("password")
        .optional({ checkFalsy: true })
        .isLength({ min: 5, max: 12 })
        .withMessage("Password must be between 5 and 12 characters long"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("Role is required")
        .isIn(["author", "admin"])
        .withMessage("Role must be either 'author' or 'admin'")

];

const CategoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category Name is required")
        .isLength({ min: 3, max: 12 })
        .withMessage("Category Name must be between 3 and 12 characters long"),

    body("description")
        .optional({ checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("Description must be less than 100 characters long")
];

const ArticleValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 7, max: 50 })
        .withMessage("Title must be between 7 and 50 characters long"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 50, max: 500 })
        .withMessage("Content must be between 50 and 500 characters long"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),
]



module.exports = {
    loginValidation,
    UserValidation,
    UserUpdateValidation,
    CategoryValidation,
    ArticleValidation
};  