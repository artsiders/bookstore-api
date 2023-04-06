const mongoose = require('mongoose');

const optionSchema = mongoose.Schema({
    short: { type: String, required: true },
    value: { type: String, required: true },
    image: { type: String, required: true },
});
module.exports = mongoose.model('Option', optionSchema);