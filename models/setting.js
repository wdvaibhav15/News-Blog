const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    website_title: { 
        type: String, 
        required: true 
    },
    website_logo: { 
        type: String, 
        required: true
     },
    footer_description: { 
        type: String, 
        required: true 
    },
});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
