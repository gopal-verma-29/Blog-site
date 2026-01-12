// models/Post.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const postSchema = new Schema({
title:{
    type: String,
    required: true
},
body:{
    type: String,
    required: true
},
createdAt:{
    type: Date,
    default: Date.now
},
updatedAt:{
    type: Date,
    default: Date.now
}
});

// Important: export the model with module.exports
module.exports = mongoose.model('Post', postSchema);