const mongoose = require('mongoose');

const examenSchema = mongoose.Schema({
    title: { type: String, required: true },
    file: { type: String, required: true, unique: true },
    thumbnail: { type: String, required: true },
    option: { type: String, required: true },
    level: { type: Number, required: true },
    level_value: { type: String, required: true },
    _idUser: { type: String, required: true },
    description: { type: String, required: false },
});
module.exports = mongoose.model('Examens', examenSchema);