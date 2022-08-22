const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    itemName: { type: String , required: true},
    category:{ type: String,
        enum: ["Electronics", "Books", "Stationary", "University Resources", "Cash", "Miscellaneous", "Personal", "Clothing and Apparel", "Toiletries and Beauty"],
         required: true},

    description:{type: String, required: true},
    item_owner: {type: mongoose.Schema.Types.ObjectId, required: true},
    on_loan: {type: Boolean, required: true},

    loan_count: {type: Number, required:true}


})

const item = mongoose.model('items', schema)
module.exports = item