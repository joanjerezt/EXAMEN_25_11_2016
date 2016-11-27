/**
 * Created by juan on 25/11/16.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var mongooseUniqueValidator = require('mongoose-unique-validator');

/*** OK ***/

var studentSchema = new Schema({
    name: {type: String, unique: true},
    address: {type: String},
    phones: [
        {
            type: {type: String},
            number: {type: Number}
        }
    ]
});

studentSchema.plugin(mongooseUniqueValidator);
module.exports = mongoose.model('studentModel', studentSchema);
