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
var studentMdl = require('./models/studentModel')(app, mongoose);
var subjectMdl = require('./models/subjectModel')(app, mongoose);
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

apiRoutes.route('/students')
    .get(ctrl.getStudent)
    .post(ctrl.setStudent)
    .delete (ctrl.removeStudent)
    .put(ctrl.updateStudent);

apiRoutes.route('/students/:id')
    .get(ctrl.findStudentById);

apiRoutes.route('/subjects')
    .get(ctrl.getSubjects)
    .post(ctrl.setSubject);

apiRoutes.route('/subjects/:id')
    .get(ctrl.findSubjectById);

apiRoutes.route('/sub')
    .post(ctrl.filterSubjectbyName);

apiRoutes.route('/subjects/:periode')
    .post(ctrl.filterSubjectbyPeriod);

apiRoutes.route('/subjects/:id/addstudent')
    .post(ctrl.addStudentToSubject);

app.use('/api', apiRoutes);

/**Start server**/
app.listen(config.port, function () {
    console.log("Node server running on http://localhost:3000");
});