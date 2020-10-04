const mongoose = require('mongoose')
const Schema = mongoose.Schema

const analyzesSchema = new Schema(
    {
        creator: {
            type: String,
            ref: 'users'
        },
        subject: {
            type: String,
            ref: 'subjects'
        },
        stoploss: Number,
        takeprofit: Number,
        entrypoint: Number,
        photos: [
            {
                file_id: String,
                file_path: String,
                file_url: String,
                message_id: String
            }

        ],
        caption: String,

        isGroup: String,

        createAt: { type: Date },

        messageURL: String,

        isPublished: Boolean
    })

module.exports = mongoose.model('analyzes', analyzesSchema);
