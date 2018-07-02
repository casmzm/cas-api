const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const coachSchema = new Schema({
    school: { type: String, default: "" },
    webpage: { type: String, default: "" },
    email: { type: String, default: "" },
    position: { type: String, default: "" },
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    state: { type: String, default: "" },
    division: { type: String, default: "" },
    sport: { type: String, default: ""},
    sent: { type: Boolean, default: false}
});

const CoachClass = mongoose.model('coach', coachSchema);

module.exports = CoachClass;
