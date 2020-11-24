const { Schema, model } = require('mongoose');

let userSchema = new Schema({
    username: String,
    password: String,
    email: String
});

const User = model('User', userSchema, 'users');

module.exports = { User }