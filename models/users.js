const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema(
    {
        _id: String,
        first_name: String,
        username: String,
        isValid: Boolean,
        createAt: { type: Date }
    })


module.exports = mongoose.model('users', usersSchema);
