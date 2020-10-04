const mongoose = require('mongoose')
const Schema = mongoose.Schema

const watchlist = new Schema(
    {
        messageId: String,
        chatId: String,
        createAt: { type: Date }
    })


module.exports = mongoose.model('watchlist', watchlist);
