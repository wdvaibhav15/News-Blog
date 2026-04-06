const categoryModel = require('../models/Category');
const createError = require('../utils/error-message');
const { validationResult } = require('express-validator');

const allCategory = async (req, res, next) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });

    const formattedCategories = categories.map((category, index) => ({
      _id: category._id,
      serial: index + 1,
      name: category.name,
      description: category.description,
      slug: category.slug,
      articleCount: 0
    }));

    res.render('admin/categories/index', {
      categories: formattedCategories,
      role: req.role
    });
  } catch (error) {
    console.log('allCategory error:', error);
    // res.status(500).send('Server Error');
    next(error);
  }
};

const addCategoryPage = async (req, res, next) => {
  try {
    res.render('admin/categories/create', { role: req.role, errors: 0 });
  } catch (error) {
    console.log('addCategoryPage error:', error);
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/categories/create', {
      role: req.role,
      errors: errors.array()
    });
  }
  try {
    const { name, description } = req.body;

    await categoryModel.create({
      name,
      description
    });

    res.redirect('/admin/category');
  } catch (error) {
    console.log('addCategory error:', error);
    // res.status(500).send('Server Error');
    next(error);
  }
};

const updateCategoryPage = async (req, res, next) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    res.render('admin/categories/update', {
      category,
      role: req.role,
      errors: 0
    });
  } catch (error) {
    console.log('updateCategoryPage error:', error);
    next(error);
  }
};
const updateCategory = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const category = await categoryModel.findById(id); // get category
    return res.render('admin/categories/update', {
      category,
      role: req.role,
      errors: errors.array()
    });
  }
  try {
    const { name, description } = req.body;

    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    category.name = name;
    category.description = description;

    await category.save();

    res.redirect('/admin/category');
  } catch (error) {
    console.log('updateCategory error:', error);
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return next(createError('Category not found', 404));
    }

    res.json({ message: true });
  } catch (error) {
    console.log('deleteCategory error:', error);
    next(error);
  }
};

module.exports = {
  allCategory,
  addCategoryPage,
  addCategory,
  updateCategoryPage,
  updateCategory,
  deleteCategory
};