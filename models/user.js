const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }
})

//plugin methods add username and password field in our userSchema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);