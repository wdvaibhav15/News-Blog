const userModel = require('../models/User');

const loginPage = async (req, res) => {
    res.render('admin/login', {
        layout: false
    });
};

const adminLogin = async (req, res) => {
    // login logic here
};

const logout = async (req, res) => {
    // logout logic here
};

const dashboard = async (req, res) => {
    res.render('admin/dashboard');
};

const setting = async (req, res) => {
    res.render('admin/setting');
};

const allUser = async (req, res) => {
    try {
        const users = await userModel.find();
        res.render('admin/users/index', { users });
    } catch (error) {
        console.log("allUser error:", error);
        res.status(500).send("Server Error");
    }
};

const addUserPage = async (req, res) => {
    res.render('admin/users/create');
};

const addUser = async (req, res) => {
    try {
        await userModel.create(req.body);
        res.redirect('/admin/users');
    } catch (error) {
        console.log("addUser error:", error);
        res.status(500).send("Server Error");
    }
};

const updateUserPage = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render('admin/users/update', { user });
    } catch (error) {
        console.log( error);
        res.status(500).send("Internal Server Error");
    }
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { fullname, password, role } = req.body;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.fullname = fullname  || user.fullname;
        if(password) {
            user.password = password;
        }
        user.role = role || user.role;
        await user.save();

        res.redirect('/admin/users');
    } catch (error) {
        console.log( error);
        res.status(500).send("Internal Server Error");
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({ message: true });
    } catch (error) {
        console.log( error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    loginPage,
    adminLogin,
    logout,
    dashboard,
    setting,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
};