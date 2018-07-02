const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const citySchema = new Schema({
    name: String,
    state: String,
    state_code: String,
    population: Number,
    emails_sent: {type: Number, default: 0}
});

const CityClass = mongoose.model('city', citySchema);

module.exports = CityClass;
