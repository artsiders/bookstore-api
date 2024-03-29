const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    speciality: { type: String, required: true },
    level: { type: Number, required: true },
    level_value: { type: String, required: true },
    image: { type: String, required: false },
    password: { type: String, required: true, select: false },
});
module.exports = mongoose.model('User', userSchema);