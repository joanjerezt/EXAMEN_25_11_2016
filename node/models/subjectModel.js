var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');

var subjectSchema = new Schema({
    name: {type: String, unique: true},
    periode: {type: Number},
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'studentModel'
    }]
});

subjectSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('subjectModel', subjectSchema);
