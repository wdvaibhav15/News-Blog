const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    timestamps: {
        type: Date,
        default: Date.now
    }
});

// use slugify to generate slug from name before saving
categorySchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Category', categorySchema);
