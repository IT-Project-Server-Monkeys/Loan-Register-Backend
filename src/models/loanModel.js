const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    loaner_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    loanee_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    item_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    status: {type: String,
        enum: ["On Loan", "Overdue", "On Time Return", "Late Return", "Early Return"],
        required: true},
    loan_start_date: {type: Date, required: true},
    intended_return_date: {type: Date, required: true},
    actual_return_date: {type: Date, required: false},
    loanee_name: {type: String, required: false},
    item_image: {type: String, required: false}
})

const loan = mongoose.model('loans', schema)
module.exports = loan
