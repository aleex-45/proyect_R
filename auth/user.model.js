const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModel = new Schema(
    {
        userName: String,
        email: String,
        password: String,
        userId: String,
        confirmed: Boolean
    });

exports.UserModel = UserModel;