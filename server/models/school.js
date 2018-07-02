const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schoolSchema = new Schema({
    name: String,
    mascot: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    web: String,
    webstore: String,
    shortabb: String,
    color_primary: String,
    color_primary_code: String,
    color_secondary: String,
    color_secondary_code: String,
    color_third: String,
    color_third_code: String,

    basketball_phone: {type: String, default: null},
    basketball_contact: {type: String, default: null},

    volleyball_phone: {type: String, default: null},
    volleyball_contact: {type: String, default: null},
    
});

const SchoolClass = mongoose.model('school', schoolSchema);

module.exports = SchoolClass;
