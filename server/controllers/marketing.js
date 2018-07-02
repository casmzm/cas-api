const fs = require('fs')
const pdf = require('html-pdf')
const City = require('../models/city');
const Email = require('../models/email');
const OrderList = require('../models/orderList');
const sprintf = require('sprintf-js').sprintf
const async = require('async')
const moment = require('moment')
let tmpl = fs.readFileSync(require.resolve('./cert.html'), 'utf8')

// sendgrid
var helper = require('sendgrid').mail;


exports.getCities = function(req, res, next){
    City.find({'state_code': req.params.state}, function(err, cities) {
        if(err){res.json(err)}
        else {
            res.json(cities)
        }
    })
}

exports.postEmails = function(req, res, next) {

    var emails = req.body.emailArray
    var state = req.body.state
    var city = req.body.city
    var term = req.body.term

    emails.forEach(function(email) {
        var newEmail = new Email()
        newEmail.address = email
        newEmail.state = state
        newEmail.city = city
        newEmail.term = term
        newEmail.sent = false
        newEmail.save(function(err) {
            if(err){
                return err
            }
        })        
    });

    res.json("success").status(200)
}

exports.getEmails = function(req,res,next){
    Email.find({"sent": false}, function(err, emails) {
        if(err){res.json(err)}
        else {
            res.json(emails)
        }
    })
}

exports.getAllEmails = function(req, res, next) {
    Email.find({}, function(err, emails) {
        if(err) {
            res.json(err)
        } else {
            res.json(emails)
        }
    })
}

exports.editEmail = function(req, res, next) {
    Email.findById(req.body._id, function(err, email) {
        if(err) {
            res.json(err).status(501)
        } else {
            email.note = req.body.note;
            email.note_read = false;
            email.save();
            res.json(email).status(200);
            console.log(email)
        }
    })
}

exports.readNote = function(req, res, next) {
    // console.log(req.body)
    Email.findById(req.params.id, function(err, email) {
        if(err) {
            res.json(err).status(501)
        } else {
            email.note_read = true;
            email.save();
            res.json(email).status(200);
            console.log(email);
        }
    })
}


exports.sendOneEmail = function(req, res, next) {
    var query = Email.findOne({"address": req.body.email})
    // console.log(req.body.email)


    var promise = query.exec()

    promise.then(function(email) {
        console.log(email)
        if(email.sent != false) {
            res.json({error: "Email already sent to this address"})
        } else
        {
        var fromEmail = new helper.Email('marketing@createashirt.com');
        var toEmail = new helper.Email(email.address);
        var subject = 'Interested in Free Shirts?';
        var city = email.city;
        var cityWithDashes = email.city.replace(" ", "-");
        var state = email.state;
        var content = new helper.Content('text/html', sprintf("<p>Hello!</p> <p>My name is Hannah. Could I send you some custom printed t-shirts with your logo on them in exchange for a link to our website, CreateAShirt.com? A simple easy to paste link like this <xmp><a href='www.createashirt.com/'>Custom Tshirts</a></xmp> would be awesome! We just launched our new website and we're trying to get some traffic to it.</p><p>A link to our page that services %1$s, %3$s would be really great! www.CreateAShirt.com</p><p>In exchange, we could print six t-shirts with your one color logo and ship them to you for free.</p><p>If not, no big deal. Just figured we would ask.</p><br><p>Thanks! </p><p>Best Regards,</p><p>Hannah Taylor</p><p>e-mail: marketing@createashirt.com</p><p>phone: (985) 241-0101</p><p>website: www.createashirt.com</p>", city, cityWithDashes, state))
        var mail = new helper.Mail(fromEmail, subject, toEmail, content)
        var sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
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
            email.save(function(err) {
                City.findOne({state_code: email.state, name: email.city}, function(err, city) {
                    city.emails_sent++
                    city.save(function(err) {
                        if(err){
                            res.json(err)
                        }
                            res.json(response)
                    })
                })
               
            })
        })}
    })

}

// exports.sendBlastEmail = function(req, res, next) {
//     var query = Email.findOne({"address": req.body.email})


//     var promise = query.exec()

//     promise.then(function(email) {
//         // console.log(email)

//         var fromEmail = new helper.Email('info@customplanet.com');
//         var toEmail = new helper.Email(email.address);
//         var subject = '15% Off All Custom T-Shirts, Hats, Beanies & Jerseys';
//         var content = new helper.Content('text/html', "<p> Our Cyber Monday sale starts now!! Get 15% off everything in the store.</p><p>Custom T-shirts, Hats, Beanies & Jerseys make a perfect gift for the holidays.</p><p>Just use the code: 15PERCENT at checkout to enjoy this great offer! Go to <a href='https://www.CustomPlanet.com'>www.CustomPlanet.com</a></p><br><br><a href='https://www.CustomPlanet.com'><img src='https://i.imgur.com/PBHslP5.png' /></a>")

//         var mail = new helper.Mail(fromEmail, subject, toEmail, content)
//         var sg = require('sendgrid')(process.env.SENDGRID_API_KEY)
//         var request = sg.emptyRequest({
//             method: 'POST',
//             path: '/v3/mail/send',
//             body: mail.toJSON()
//             });
//             var mail = new helper.Mail(fromEmail, subject, toEmail, content)
//             var sg = require('sendgrid')(process.env.LEVI_EMAILS)
//             var request = sg.emptyRequest({
//                 method: 'POST',
//                 path: '/v3/mail/send',
//                 body: mail.toJSON()
//                 });
//             sg.API(request, function(err, response) {
//                 if (err) {
//                     console.log(err)
//                 }
//                 email.sent = true;
              
//                 email.save(function (err) {
//                   if (err) {
//                     console.log(err);
//                   }
//                   var newResponse = {
//                     response,
//                     email
//                   }
//                   res.json(newResponse)
//                 });
                
//             })
//     // 
//     })
//     // res.json(req.body.email)

// }

exports.sendBlastEmail = function(req, res, next) {
    var query = OrderList.find({}, function(err, emails) {
        emails.forEach(function(email) {
                if(email.sent === false){
                // console.log(email)
                var fromEmail = new helper.Email('info@customplanet.com');
                var toEmail = new helper.Email(email.email);
                var subject = '15% Off All Custom T-Shirts, Hats, Beanies & Jerseys';
                var content = new helper.Content('text/html', "<p> Our Cyber Monday sale starts now!! Get 15% off everything in the store.</p><p>Custom T-shirts, Hats, Beanies & Jerseys make a perfect gift for the holidays.</p><p>Just use the code: 15PERCENT at checkout to enjoy this great offer! Go to <a href='https://www.CustomPlanet.com'>www.CustomPlanet.com</a></p><br><br><a href='https://www.CustomPlanet.com'><img src='https://i.imgur.com/PBHslP5.png' /></a>")
        
        
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
                    })
                }})
            })
}

exports.getMetrics = function(req, res, next) {
    var chartArray = []

    var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    var request = sg.emptyRequest({
      method: 'GET',
      path: '/v3/stats?start_date=2017-08-10',
    });

    sg.API(request)
        .then(function(response) {
            // console.log(response.body[0].stats[0])
            response.body.forEach(function(date) {
                var chartData = {
                    date: date.date.replace('2017-', ''),
                    requests: date.stats[0].metrics.requests,
                    opens: date.stats[0].metrics.opens,
                    unique_opens: date.stats[0].metrics.unique_opens
                }
                chartArray.push(chartData)
            })
            res.json(chartArray)
        })
}

exports.deleteEmail = function(req, res, next) {
    Email.findOneAndRemove({_id: req.params.id}, function(err, email) {
        if(err) {
            console.log(err);
            res.json(err).status(501);
        } else {
            res.json({'success': req.params.id}).status(200)
        }
    })
}

exports.getCertificate = function(req, res, next) {

  var date_completed = moment(req.body.date_completed).format('MMMM Do YYYY')

  var html = tmpl
    .replace('{{name}}', req.body.name)
    .replace('{{date_completed}}', date_completed)
    .replace('{{course_title}}', req.body.course_title)

  pdf.create(html, {'format': 'Letter', 'height': '8.5in', 'width': '11in'}).toStream((err, stream) => {
    if (err) return res.end(err.stack)
    res.setHeader('Content-Type', 'application/pdf')
    stream.pipe(res)
  })
}

