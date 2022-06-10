const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    type:String
}, {collection: 'user'})
const User = module.exports = mongoose.model('user', userSchema);