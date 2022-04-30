const mongoose = require('mongoose');

const shortLinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
    },
    shortlink: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    tags: {
        type: String,
        trim: true,
    },

    createdAt: { type: Date, default: Date.now },

    updatedAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('ShortLink', shortLinkSchema)