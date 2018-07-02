const School = require('../models/school');

exports.getSchools = function(req, res, next){
    
    let query = School.find({'state': req.params.state})
    let promise = query.exec()

    promise.then(function(data) {
    res.json(data).status(200)
  }) 
  console.log(req.params.state)
}

exports.newSchool = function(req, res, next){
    delete req.body._id;
    
    const school = new School(req.body);
    school.status = 'To Do';
    school.save();
    res.json(school).status(200);

}

exports.editSchool = function(req, res, next) {
    console.log(req.body)
    School.findById(req.body._id, function(err, school) {
        if(err) {
            res.json(err).status(501)
        } else {
            school.name = req.body.name;
            school.mascot = req.body.mascot
            school.address = req.body.address
            school.city = req.body.city
            school.state = req.body.state
            school.zip = req.body.zip
            school.web = req.body.web
            school.webstore = req.body.webstore
            school.shortabb = req.body.shortabb
            school.color_primary = req.body.color_primary
            school.color_primary_code = req.body.color_primary_code
            school.color_secondary = req.body.color_secondary
            school.color_secondary_code = req.body.color_secondary_code
            school.color_third = req.body.color_third
            school.color_third_code = req.body.color_third_code

            school.basketball_phone = req.body.basketball_phone
            school.basketball_contact = req.body.basketball_contact

            school.volleyball_phone = req.body.volleyball_phone
            school.volleyball_contact = req.body.volleyball_contact

            school.save();
            res.json(school).status(200);
        }
    })
}

exports.deleteSchool = function(req, res, next) {
    School.findOneAndRemove({_id: req.params.id}, function(err, project) {
        if(err) {
            console.log(err);
            res.json(err).status(501);
        } else {
            res.json('success').status(200)
        }
    })
}