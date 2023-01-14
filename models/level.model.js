const mongoose = require('mongoose');

const levelSchema = mongoose.Schema({
    value: { type: String, required: true, unique: true },
    level: { type: Number, required: true, },
});
module.exports = mongoose.model('Level', levelSchema);