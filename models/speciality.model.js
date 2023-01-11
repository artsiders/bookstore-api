const mongoose = require('mongoose');

const specialitySchema = mongoose.Schema({
    short: { type: String, required: true },
    value: { type: String, required: true },
});
module.exports = mongoose.model('Speciality', specialitySchema);