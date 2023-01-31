const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    theme: { type: String, required: true },
    pdfName: { type: String, required: true, unique: true },
    docxName: { type: String, required: true },
    thumbnail: { type: String, required: true },
    option: { type: String, required: true },
    level: { type: Number, required: true },
    level_value: { type: String, required: true },
    year: { type: Number, required: true },
    _idUser: { type: String, required: true },
    description: { type: String, required: false },
});
module.exports = mongoose.model('Book', bookSchema);