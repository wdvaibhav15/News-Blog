const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    slug: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

categorySchema.pre('validate', function () {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true
    });
  }
});

module.exports = mongoose.model('Category', categorySchema);