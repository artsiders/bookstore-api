const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    theme: { type: String, required: true },
    fileName: { type: String, required: true },
    thumbnail: { type: String, required: true },
    option: { type: String, required: true },
    niveau: { type: Number, required: true },
    year: { type: String, required: true },
    description: { type: String, required: false },
});
module.exports = mongoose.model('Book', bookSchema);