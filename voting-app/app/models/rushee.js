// app/models/rushee.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var rusheeSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    personal         : {
        first_name        : String,
        last_name         : String, 
        year              : String, 
        major             : String
    },
    role             : {
        type: String, 
        default: "Rushee" 
    }, 
    votes: [{
        vote:       {type: String},
        brother_id: {type: String},
     }],
});

// methods ======================
// generating a hash
rusheeSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
rusheeSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Rushee', rusheeSchema);