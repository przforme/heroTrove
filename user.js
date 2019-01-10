var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

var userSchema = mongoose.Schema({
    name: {type: String, default: "User"},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true}
});
var User = mongoose.model("User", userSchema);

module.exports = User;