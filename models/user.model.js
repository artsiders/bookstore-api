const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    speciality: { type: String, required: true },
    password: { type: String, required: true },
});
module.exports = mongoose.model('User', userSchema);