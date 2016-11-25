var mongoose = require('mongoose');
var studentModel = mongoose.model('studentModel');
var subjectModel = mongoose.model('subjectModel');
var jwt = require('jsonwebtoken');
var express = require("express");
var app = express();
var config = require('../config/config');
app.set('superSecret', config.secret);
var crypto = require('crypto');


/**** STUDENTS ****/

/** OK **/

/**GET list of all students**/
exports.getStudent = function (req, res) {
    studentModel.find(function (err, students) {
        if (err) res.send(500, err.message);
        res.status(200).jsonp(students);
    });
};

/** OK **/

/** DELETE a STUDENT **/

exports.removeStudent = function (req, res) {
    studentModel.remove({_id: req.params.id}, function (err, student) {
        if (err)
            res.send(err);
        // Obtiene y devuelve todos los students tras borrar uno de ellos
        studentModel.find(function (err, student) {
            if (err)
                res.send(err)
            res.json(student);
        });
    });
}

/** PARCIAL **/

/**POST add new student to DB**/

exports.setStudent = function (req, res) {
    var student = new studentModel({
        name: req.body.name,
        address: req.body.address,
        phones: {
            name: req.body.phones.name,
            number: req.body.phones.number
        }
    });
    student.save(function (err, student) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(student);
    });
};

/* PUT a STUDENT */

exports.updateStudent = function (req, res) {
    Student.update({_id: req.params.id},
        {
            $set: {
                name: req.body.name,
                address: req.body.address,
                phones: {name: req.body.phones.name, number: req.body.phones.number}
            }
        },
        function (err, fijo) {
            if (err)
                res.send(err);
            // Obtine y devuelve todos los students tras crear uno de ellos
            Student.find(function (err, student) {
                if (err)
                    res.send(err)
                res.json(student);
            });
        });
}

/**** SUBJECTS ****/

/* Filtro por nombre */

exports.filterSubjectbyName = function (req, res){

    subjectModel.find({name: req.body.name},
        function(err, subject) {
            if (err)
                res.send(err)
            res.json(subject); // devuelve todas las Asignaturas en JSON
        }
    );
}

/*
 Filtro por periode en el que s’imparteix, p.ex “Tardor 2016”, “Primavera 2017”.
*/

exports.filterSubjectbyPeriod = function (req, res){

    subjectModel.find({periode: req.body.periode},
        function(err, subject) {
            if (err)
                res.send(err)
            res.json(subject); // devuelve todas las Asignaturas en JSON
        }
    );
}

/* Ver detalle de una asignatura */

/**GET subject by subject._id**/
exports.findSubjectById = function (req, res) {
    subjectModel.findById(req.params.id, function (err) {
        if (err != null) return res.send(500, err.message);
    })
        .populate('students')
        .exec(function (error, subject) {
            console.log(JSON.stringify(subject, null, "\t"));
            res.status(200).jsonp(subject);
        });
};


/**GET a list of all Subjects**/
exports.getSubjects = function (req, res) {
    subjectModel.find(function (err, subjects) {
        if (err) res.send(500, err.message);
        res.status(200).jsonp(subjects);
    });
};

 /** GET Find student by student._id **/

exports.findStudentById = function (req, res) {
    studentModel.findById(req.params.id, function (err, student) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(student);
    });
};

/** GET a list of all Subjects **/
exports.getSubjects = function (req, res) {
    subjectModel.find(function (err, subjects) {
        if (err) res.send(500, err.message);
        res.status(200).jsonp(subjects);
    });
};

/** POST add subject to DB **/

exports.setSubject = function (req, res) {
    var subject = new subjectModel({
        name: req.body.name,
        description: req.body.description
    });
    subject.save(function (err) {
        if (err) return res.send(500, err.message);
        subjectModel.find(function (err, subjects) {
            if (err) res.send(500, err.message);
            res.status(200).jsonp(subjects);
        });
    });
};

/** GET subject by subject._id **/
exports.findSubjectById = function (req, res) {
    subjectModel.findById(req.params.id, function (err) {
        if (err != null) return res.send(500, err.message);
    })
        .populate('students')
        .exec(function (error, subject) {
            console.log(JSON.stringify(subject, null, "\t"));
            res.status(200).jsonp(subject);
        });
};

/**POST insert student into subject collection**/
exports.addStudentToSubject = function (req, res) {
    /**First add student to DB**/
    var student = new studentModel({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        phones: {
            name: req.body.name,
            number: req.body.number
        }
    });
    student.save(function (err, student) {
        if (err) return res.send(500, err.message);
        /**Using populate see here: https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/ **/
        /**We insert the student inside the Subject collection**/
        subjectModel.find({
            _id: req.params.id
        }, function (err, subjects) {
            if (err) return res.send(500, err.message);
            console.log("subjects:");
            console.log(subjects);
            var subject = subjects[0];
            subject.students.push(student._id);
            subject.save(function (err, subject) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp(subject);
            });
        });
    });
};

/**GET Find student by student._id**/
exports.findStudentById = function (req, res) {
    studentModel.findById(req.params.id, function (err, student) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(student);
    });
};

/**POST insert student into subject collection**/
exports.addStudentToSubject = function (req, res) {
    /**First add student to DB**/
    var student = new studentModel({
        name: req.body.name,
        description: req.body.description,
        address: req.body.address,
        phones: {
            name: req.body.name,
            number: req.body.number
        }
    });
    student.save(function (err, student) {
        if (err) return res.send(500, err.message);
        /**Using populate see here: https://alexanderzeitler.com/articles/mongoose-referencing-schema-in-properties-and-arrays/ **/
        /**We insert the student inside the Subject collection**/
        subjectModel.find({
            _id: req.params.id
        }, function (err, subjects) {
            if (err) return res.send(500, err.message);
            var subject = subjects[0];
            subject.students.push(student._id);
            subject.save(function (err, subject) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp(subject);
            });
        });
    });
};
