const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subjectsSchema = new Schema(
    {
        name:
        {
            type: String,
            unique: true
        }
    })

module.exports = mongoose.model('subjects', subjectsSchema);