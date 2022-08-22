const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    loaner_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    loanee_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    item_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    status: {type: String,
        enum: ["Current", "On Time Return", "Late Return", "Early Return"],
        required: true},
    loan_start_date: {type: Date, required: true},
    intended_return_date: {type: Date, required: true},
    actual_return_date: {type: Date, required: true}
})

const loan = mongoose.model('loans', schema)
module.exports = loan
