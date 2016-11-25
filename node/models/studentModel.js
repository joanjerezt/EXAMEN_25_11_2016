var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');

var studentSchema = new Schema({
    name: {type: String, unique: true},
    address: {type: String},
    phones: [
        {
            name: {type: String},
            number: {type: Number}
        }
    ]
});

studentSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('studentModel', studentSchema);
