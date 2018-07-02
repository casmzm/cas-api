var path = require('path');
var router = require('express').Router();
const passport = require('passport');
const passportService = require('../services/passport');


const Authentication = require('../controllers/authentication');
const Users = require('../controllers/users');
const Projects = require('../controllers/projects');
const Marketing = require('../controllers/marketing');
const Schools = require('../controllers/schools');
const Coaches = require('../controllers/coaches')


const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', {session: false});


// Authentication
router.post('/signin', requireSignin, Authentication.signin);
router.post('/signup', Authentication.signup);

// Project
router.get('/project', Projects.getProjects);
router.post('/project', Projects.newProject);
router.patch('/project', Projects.editProject);
router.delete('/project/:id', Projects.deleteProject);

// User
router.get('/user', Users.getuser);
router.post('/user/addfavorite', Users.addFavorite);

// Marketing
router.get('/city/:state', Marketing.getCities)
router.post('/email', Marketing.postEmails)
router.get('/emails', Marketing.getEmails)
router.get('/allemails', Marketing.getAllEmails)
router.post('/send', Marketing.sendOneEmail)
router.get('/metrics', Marketing.getMetrics)
router.delete('/email/:id', Marketing.deleteEmail)
router.patch('/editEmail', Marketing.editEmail)
router.patch('/readNote/:id', Marketing.readNote)

// Schools
router.get('/schools/:state', Schools.getSchools)
router.patch('/editSchool', Schools.editSchool)

// Coaches
router.get('/coaches/:state', Coaches.getCoaches);
router.get('/sentcoaches/', Coaches.getSentCoaches);
router.get('/division/:division', Coaches.getDivisions);
router.get('/division/:division/:state', Coaches.getDivisionState);
router.post('/coaches', Coaches.newCoach);
router.post('/coaches/:id', Coaches.sendOneEmail)
router.patch('/coaches', Coaches.editCoach)
router.delete('/coaches/:id', Coaches.deleteCoach)

router.post('/blastemail', Marketing.sendBlastEmail)

router.post('/certificate', Marketing.getCertificate)

module.exports = router;
