const categoryModel = require('../models/Category');

const allCategory = async (req, res) => {
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
    res.status(500).send('Server Error');
  }
};

const addCategoryPage = async (req, res) => {
  try {
    res.render('admin/categories/create', { role: req.role });
  } catch (error) {
    console.log('addCategoryPage error:', error);
    res.status(500).send('Server Error');
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    await categoryModel.create({
      name,
      description
    });

    res.redirect('/admin/category');
  } catch (error) {
    console.log('addCategory error:', error);
    res.status(500).send('Server Error');
  }
};

const updateCategoryPage = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('admin/categories/update', {
      category,
      role: req.role
    });
  } catch (error) {
    console.log('updateCategoryPage error:', error);
    res.status(500).send('Server Error');
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    category.name = name;
    category.description = description;

    await category.save();

    res.redirect('/admin/category');
  } catch (error) {
    console.log('updateCategory error:', error);
    res.status(500).send('Server Error');
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.json({ message: true });
  } catch (error) {
    console.log('deleteCategory error:', error);
    res.status(500).send('Server Error');
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