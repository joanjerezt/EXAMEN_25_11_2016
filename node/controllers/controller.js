/**
 * Created by juan on 25/11/16.
 */

var mongoose = require('mongoose');
var studentModel = mongoose.model('studentModel');
var subjectModel = mongoose.model('subjectModel');
var express = require("express");


/**** STUDENTS ****/

/** OK **/

exports.getStudent = function (req, res) {
    studentModel.find(function (err, students) {
        if (err) res.send(500, err.message);
        res.status(200).jsonp(students);
    });
};

/** OK **/

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

/** OK **/

exports.setStudent = function (req, res) {
    var student = new studentModel({
        name: req.body.name,
        address: req.body.address,
        phones: {
            type: req.body.type,
            number: req.body.number
        }
    });
    student.save(function (err, student) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(student);
    });
};

/** OK **/

exports.updateStudent = function (req, res) {
    studentModel.update({_id: req.params.id},
        {
            $set: {
                name: req.body.name,
                address: req.body.address,
                phones: {
                    type: req.body.type,
                    number: req.body.number}
            }
        },
        function (err, fijo) {
            if (err)
                res.send(err);
            // Obtiene y devuelve todos los students tras crear uno de ellos
            studentModel.find(function (err, student) {
                if (err)
                    res.send(err)
                res.json(student);
            });
        });
}

/** OK **/

exports.findStudentById = function (req, res) {
    studentModel.findById(req.params.id, function (err, student) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp(student);
    });
};


/**** SUBJECTS ****/

/*** OK ***/

exports.getSubjects = function (req, res) {
    subjectModel.find(function (err, subjects) {
        if (err) res.send(500, err.message);
        res.status(200).jsonp(subjects);
    });
};

/*** OK ***/

exports.setSubject = function (req, res) {
    var subject = new subjectModel({
        name: req.body.name,
        periode: req.body.periode
    });
    subject.save(function (err) {
        if (err) return res.status(500).send(err.message);
        subjectModel.find(function (err, subjects) {
            if (err) res.status(500).send(err.message);
            res.status(200).jsonp(subjects);
        });
    });
};

/*** OK ***/

exports.filterSubjectbyName = function (req, res){

    subjectModel.find({name: req.params.name},
        function(err, subject) {
            if (err)
                res.send(err)
            res.json(subject); // devuelve todas las Asignaturas en JSON
        }
    );
}

/* Filtro por periode en el que s’imparteix, p.ex “Tardor 2016”, “Primavera 2017”. */

exports.filterSubjectbyPeriod = function (req, res){

    subjectModel.find({periode: req.params.periode},
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

/**POST insert student into subject collection**/

exports.addStudentToSubject = function (req, res) {
    /**First add student to DB**/
    var student = new studentModel({
        name: req.body.name,
        address: req.body.address,
        phones: {
            type: req.body.type,
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