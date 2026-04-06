const categoryModel = require('../models/Category');

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
    res.render('admin/categories/create', { role: req.role });
  } catch (error) {
    console.log('addCategoryPage error:', error);
    next(error);
  }
};

const addCategory = async (req, res, next) => {
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
      role: req.role
    });
  } catch (error) {
    console.log('updateCategoryPage error:', error);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
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