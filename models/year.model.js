const mongoose = require('mongoose');

const yearSchema = mongoose.Schema({
    value: { type: Number, required: true, unique: true },
});
module.exports = mongoose.model('Year', yearSchema);