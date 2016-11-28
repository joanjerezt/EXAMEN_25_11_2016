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

/*** PHONE ***/

/*** OK ***/

exports.setPhone = function (req, res){

    var query = {_id: req.params.id};
    var update = {$addToSet : {phones :{type: req.body.type, number: req.body.number}}};
    var options = {};

    studentModel.findOneAndUpdate(query, update, options, function(err, student) {
        if (err) {
            res.send(err);
        }
        if(student){
            studentModel.findById(student._id).populate('phones').exec().then(function(err, student) {
                if (err)
                    res.send(err)
                res.send(student);
            });
        }
    });
};

/*** OK ***/

exports.removePhone = function (req, res){

var query = {_id: req.params.id};
var update = {$pull : {phones:{ _id: req.params.phone_id}}};
var options = {};
studentModel.findOneAndUpdate(query, update, options, function(err, student) {
    if (err) {
        res.send(err);
    }
    if(student){
        studentModel.findById(student._id).populate('phones').exec().then(function(err, student) {
            if (err)
                res.send(err)
            res.send(student);
        });
    }
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

exports.removeSubject = function (req, res) {
    subjectModel.remove({_id: req.params.id}, function (err, subjects) {
        if (err)
            res.send(err);

        subjectModel.find(function (err, subjects) {
            if (err)
                res.send(err)
            res.json(subjects);
        });
    });
}

/*** OK ***/

exports.updateSubject = function (req, res) {
    subjectModel.update({_id: req.params.id},
        {
            $set: {
                name: req.body.name,
                periode: req.body.periode
            }
        },
        function (err, fijo) {
            if (err)
                res.send(err);
            subjectModel.find(function (err, student) {
                if (err)
                    res.send(err)
                res.json(student);
            });
        });
}

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

/*** OK *** /

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

/** OK **/

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

/*** OK ***/

/**POST insert student into subject collection**/

exports.addStudentToSubject = function (req, res) {

    var query = {_id: req.params.id};
    var update = {$addToSet : {"students" : req.body.student_id}};
    var options = {};
    subjectModel.findOneAndUpdate(query, update, options, function(err, subject) {
        if (err) {
            res.send(err);
        }
        if(subject){
            subjectModel.findById(subject._id).populate('students').exec().then(function(err, subject) {
                if (err)
                    res.send(err)
                res.send(subject);
            });
        }
    });
};

/*** OK ***/

exports.removeStudentFromSubject = function (req, res){
    var query = {_id: req.params.id};
    var update = {$pull : {"students" : req.params.student_id}};
    var options = {};
    subjectModel.findOneAndUpdate(query, update, options, function(err, subject) {
        if (err) {
            res.send(err);
        }
        if(subject){
            subjectModel.findById(subject._id).populate('students').exec().then(function(err, subject) {
                if (err)
                    res.send(err)
                res.send(subject);
            });
        }
    });
};