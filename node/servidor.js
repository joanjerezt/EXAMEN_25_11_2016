/**
 * Created by juan on 25/11/16.
 */

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require('mongoose');
morgan = require('morgan');

var config = require('./config/config');

mongoose.Promise = global.Promise;

/**Connection to local MongoDB**/
mongoose.connect(config.database, function (err) {
    if (err) throw err;
    console.log('Connected to Database');
});

/**Middlewares**/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

/**Morgan to log requests to the console**/
app.use(morgan('dev'));

/** Import Models and controllers**/
var studentModel = require('./models/studentModel')(app, mongoose);
var subjectModel = require('./models/subjectModel')(app, mongoose);
var ctrl = require('./controllers/controller');

app.use(express.static(__dirname + '/angular'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token");
    next();
});

/**------------**/
/** API routes **/
/**------------**/

var apiRoutes = express.Router();

/*** STUDENTS ***/

apiRoutes.route('/students')
    .get(ctrl.getStudent)
    .post(ctrl.setStudent);

apiRoutes.route('/students/:id')
    .get(ctrl.findStudentById)
    .delete (ctrl.removeStudent)
    .post(ctrl.setPhone)
    .put(ctrl.updateStudent);
apiRoutes.route('/students/:id/:phone_id')
    .delete(ctrl.removePhone);

/*** SUBJECTS ***/

apiRoutes.route('/subjects')
    .get(ctrl.getSubjects)
    .post(ctrl.setSubject);

apiRoutes.route('/subjects/:id')
    .get(ctrl.findSubjectById)
    .delete(ctrl.removeSubject)
    .put(ctrl.updateSubject);

apiRoutes.route('/subjects/name/:name')
    .get(ctrl.filterSubjectbyName);

apiRoutes.route('/subjects/period/:periode')
    .get(ctrl.filterSubjectbyPeriod);

apiRoutes.route('/subjects/:id/addstudent')
    .post(ctrl.addStudentToSubject);

app.use('/api', apiRoutes);

/**Start server**/
app.listen(config.port, function () {
    console.log("Node server running on http://localhost:3000");
});