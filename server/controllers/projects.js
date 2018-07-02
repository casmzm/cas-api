const Project = require('../models/project');

exports.getProjects = function(req, res, next){
    
    let query = Project.find()
    let promise = query.exec()

    promise.then(function(data) {
    res.json(data).status(200)
  }) 
}

exports.newProject = function(req, res, next){
    delete req.body._id;
    
    const project = new Project(req.body);
    project.status = 'To Do';
    project.date_added = Date.now();
    project.save();
    res.json(project).status(200);

}

exports.editProject = function(req, res, next) {
    Project.findById(req.body._id, function(err, project) {
        if(err) {
            res.json(err).status(501)
        } else {
            project.status = req.body.status;
            project.assigned = req.body.assigned;
            project.image = req.body.image;
            project.website = req.body.website;
            project.link = req.body.link;
            project.description = req.body.description;
            project.page = req.body.page;
            project.priority = req.body.priority;
            project.save();
            res.json(project).status(200);
        }
    })
}

exports.deleteProject = function(req, res, next) {
    Project.findOneAndRemove({_id: req.params.id}, function(err, project) {
        if(err) {
            console.log(err);
            res.json(err).status(501);
        } else {
            res.json('success').status(200)
        }
    })
}
