// models/user.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
username:{
    type: String,
    required: true,
    unique: true
},
password:{
    type: String,
    required: true,
}
});

// Important: export the model with module.exports
module.exports = mongoose.model('User', UserSchema);