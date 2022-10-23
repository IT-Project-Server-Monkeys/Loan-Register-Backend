const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    item_name: { type: String , required: true},
    category:{ type: String, required: true},
    description:{type: String, required: true},
    item_owner: {type: mongoose.Schema.Types.ObjectId,required:true},
    being_loaned: {type: Boolean,required:true},
    loan_frequency: {type: Number,required:true},
    visible: {type: Boolean, required:true},
    image_url: {type: String, required: false}
})

const item = mongoose.model('items', schema)
module.exports = item