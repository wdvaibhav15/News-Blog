const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userModel = require('../models/User');
const newsModel = require('../models/News');
const categoryModel = require('../models/Category');
const settingModel = require('../models/setting');

dotenv.config();

const loginPage = async (req, res) => {
    res.render('admin/login', {
        layout: false
    });
};

const adminLogin = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).send({ message: "Invalid username or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ message: "Invalid username or password" });
        }

        const jwtData = {
            id: user._id,
            fullname: user.fullname,
            role: user.role
        };

        const token = jwt.sign(jwtData, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/');
};

const dashboard = async (req, res, next) => {
    try {
        let articlesCount;

        if (req.role === 'author') {
            articlesCount = await newsModel.countDocuments({ author: req.id });
        } else {
            articlesCount = await newsModel.countDocuments();
        }

        const categoriesCount = await categoryModel.countDocuments();
        const usersCount = await userModel.countDocuments();

        res.render('admin/dashboard', {
            role: req.role,
            fullname: req.fullname,
            articlesCount,
            categoriesCount,
            usersCount
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const settings = async (req, res, next) => {
    try {
        const settingsData = await settingModel.findOne();

        res.render('admin/setting', {
            role: req.role,
            settings: settingsData
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const saveSettings = async (req, res, next) => {
    const { website_title, footer_description } = req.body;
    const website_logo = req.file ? req.file.filename : null;

    try {
        const existingSettings = await settingModel.findOne();

        let updatedData = {
            website_title,
            footer_description
        };

        if (website_logo) {
            updatedData.website_logo = website_logo;
        }

        await settingModel.findOneAndUpdate(
            {},
            updatedData,
            { new: true, upsert: true }
        );

        res.redirect('/admin/settings');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const allUser = async (req, res, next) => {
    try {
        const users = await userModel.find().sort({ _id: 1 });

        const formattedUsers = users.map((user, index) => ({
            _id: user._id,
            serial: index + 1,
            fullname: user.fullname,
            username: user.username,
            role: user.role
        }));

        res.render('admin/users/index', {
            users: formattedUsers,
            role: req.role
        });
    } catch (error) {
        console.log("allUser error:", error);
        next(error);
    }
};

const addUserPage = async (req, res) => {
    res.render('admin/users/create', { role: req.role });
};

const addUser = async (req, res, next) => {
    try {
        await userModel.create(req.body);
        res.redirect('/admin/users');
    } catch (error) {
        console.log("addUser error:", error);
        next(error);
    }
};

const updateUserPage = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return next(createError('User not found', 404));
        }

        res.render('admin/users/update', {
            user,
            role: req.role
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { fullname, password, role } = req.body;

    try {
        const user = await userModel.findById(id);

        if (!user) {
            return next(createError('User not found', 404));
        }

        user.fullname = fullname || user.fullname;

        if (password) {
            user.password = password;
        }

        user.role = role || user.role;

        await user.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    try {
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return next(createError('User not found', 404));
        }

        res.json({ message: true });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports = {
    loginPage,
    adminLogin,
    logout,
    dashboard,
    settings,
    saveSettings,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
};