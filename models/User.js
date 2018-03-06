const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    userDatas: [],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
