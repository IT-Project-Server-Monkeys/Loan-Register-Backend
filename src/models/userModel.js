const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    display_name: {type: String, required: true,unique: true},
    login_email: {type: String, required: true, unique: true},
    hashed_password: {type: String, required: true},
    item_categories:{ type: [String], required: true}
});
const user = mongoose.model('users', schema);
module.exports = user;