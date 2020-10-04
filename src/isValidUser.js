const mongoose = require('mongoose')
const users = require('../models/users')

function isValidUser(userId) {

    var db = mongoose.connection;

    return users.findOne({ _id: userId }, function (err, user) {
        if (err) {
            //     check with telegram group
            //     if (be in telegram group){
            //         add to database 
            //         continue
            //     }else{
            //         message : you dont have permition
            //     }
        } else {
            return true
        }
    })
}