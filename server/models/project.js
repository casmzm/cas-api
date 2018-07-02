const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const projectSchema = new Schema({
    page: { type: String, default: ""},
    description: { type: String, default: ""},
    link: { type: String, default: ""},
    image: { type: String, default: ""},
    assigned: { type: String, default: ""},
    status: { type: String, default: ""},
    priority: { type: String, default: "Low"},
    website: { type: String, default: "" },
    date_added: { type: Date }
});

const ProjectClass = mongoose.model('project', projectSchema);

module.exports = ProjectClass;
