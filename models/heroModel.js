var mongoose = require('mongoose');

var HeroSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    heroName: {type: String, required: true},
    heroDesc: {type: String, required: true, unique: true},
    createDate: {type: Date, required: true, default: Date.now},
    modifyDate: {type: Date}
});
var Hero = mongoose.model("Character", HeroSchema);

// Virtual for hero's URL
HeroSchema
.virtual('url')
.get(function () {
  return '/heroes/' + this._id;
});

module.exports = Hero;