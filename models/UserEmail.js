const mongoose = require('mongoose');

const userEmailSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    data: {
        pixels: [],
    },
}, { timestamps: true });

const UserEmail = mongoose.model('UserEmail', userEmailSchema);

module.exports = UserEmail;
