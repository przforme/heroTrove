var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Virtual for user's URL
UserSchema
    .virtual('url')
    .get(function () {
        return '/user/' + this._id;
    });

module.exports = mongoose.model("User", UserSchema);
