const Coach = require('../models/coach');

var helper = require('sendgrid').mail;

exports.getCoaches = function(req, res, next){
  
  let query = Coach.find({'state': req.params.state})
  let promise = query.exec()

  promise.then(function(data) {
  res.json(data).status(200)
}) 
console.log(req.params.state)
}

exports.newCoach = function(req, res, next) {
  delete req.body._id;
  var coach = new Coach(req.body);
  // delete coach._id;
  // console.log(coach); 
  coach.save(function (err, newCoach) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(newCoach)
    }
  });

  // res.json("hello from newCoach").status(200);
}

exports.sendOneEmail = function(req, res, next) {
  var query = Coach.findOne({"_id": req.params.id})
  
  var promise = query.exec()
      promise.then(function(email) {
          if(email.sent != false) {
            console.log("broke in email")
              res.json({error: "Email already sent to this address"})
          } else
          {
          var fromEmail = new helper.Email('levitaylor2018@gmail.com');
          var toEmail = new helper.Email(email.email);
          var subject = `Levi Taylor | Top 3 Senior Quarterback in California (TD's and Yards) | 2016 Top 10 JR Quarterback in the nation (total yards)`
            var content = new helper.Content('text/html', "Coach,<br><br>My name is Levi Taylor. I'm a Senior Quarterback at Silverado High School in Victorville, CA.  Last year I finished <a href='http://www.maxpreps.com/leaders/football-fall-16/offense,total+yards/stat-leaders.htm?classyear=11&position=qb'>#10 in the country </a>for Junior Quarterbacks for Total Yards. <br> I finished my senior year <a href='http://www.maxpreps.com/list/stat_leaders.aspx?gendersport=boys,football&state=ca'>#3 for all senior QB's in California for total yards and TDs.</a>  We were hoping to go to the CIF Championship again this year, but we lost our playoff game in the semi-finals in double overtime. <br><br>Anyways, I saw your school and was wondering if you already have a 2018 QB picked out? <a href='https://drive.google.com/drive/folders/1mThWF5FKMbHg86meI-YVb5rxIFB5xMn-'>Here's a link</a> to my grades and SAT scores.<br><br>Thanks!<br><br>Levi Taylor<br>(760) 680-3651<br>@levitaylor2006<br><a href='https://www.hudl.com/video/3/7102036/59c028c94bb2890d2cb8d99a'>View HUDL here</a><br><br><a href='https://www.hudl.com/video/3/7102036/59c028c94bb2890d2cb8d99a'><img src='https://i.imgur.com/A7gYI7y.png' /></a>")
          var mail = new helper.Mail(fromEmail, subject, toEmail, content)
          var sg = require('sendgrid')(process.env.LEVI_EMAILS)
          var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON()
              });
          sg.API(request, function(err, response) {
              if (err) {
                  console.log(err)
              }
              email.sent = true;
            
              email.save(function (err) {
                if (err) {
                  console.log(err);
                }
                var newResponse = {
                  response,
                  email
                }
                res.json(newResponse)
              });
              
          })}
      })
}

exports.getDivisions = function (req, res) {
  let query = Coach.find({ 'division': req.params.division })
  let promise = query.exec()

  promise.then(function (data) {
    res.json(data).status(200)
  })
}

exports.getDivisionState = function (req, res) {
  let query = Coach.find({ 'division': req.params.division, 'state': req.params.state })
  let promise = query.exec()

  promise.then(function (data) {
    res.json(data).status(200)
  })
}


exports.getSentCoaches = function (req, res) {
  let query = Coach.find({ 'sent': true })
  let promise = query.exec()

  promise.then(function (data) {
    res.json(data).status(200)
  })
}

exports.editCoach = function(req, res, next) {
  
  Coach.findById(req.body._id, function(err, coach) {
      if(err) {
          res.json(err).status(501)
      } else {
          coach.name = req.body.name;
          coach.sport = req.body.sport;
          coach.division = req.body.division;
          coach.state = req.body.state;
          coach.phone = req.body.phone;
          coach.position = req.body.position;
          coach.email = req.body.email;
          coach.webpage = req.body.webpage;
          coach.school = req.body.school;

          coach.save();
          res.json(coach).status(200);
      }
  })
}

exports.deleteCoach = function(req, res, next) {
  Coach.findOneAndRemove({_id: req.params.id}, function(err, coach) {
      if(err) {
          console.log(err);
          res.json(err).status(501);
      } else {
          res.json('success').status(200)
      }
  })
}
