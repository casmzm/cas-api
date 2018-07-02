const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const emailSchema = new Schema({
    address: { type: String, default: ""},
    state: { type: String, default: ""},
    sent: { type: Boolean, default: false},
    term: { type: String, default: ""},
    city: { type: String, default: ""},
    note: { type: String, default: ""},
    note_read: { type: Boolean, default: false}
});

const EmailClass = mongoose.model('email', emailSchema);

module.exports = EmailClass;
