var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new Schema({
    name: String,
    data: String,
    img: Image
});

module.exports = mongoose.model('Level', LevelSchema);
