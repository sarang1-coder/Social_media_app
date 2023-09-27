const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/social-media-app');

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'Error in connection DB'));


db.once('open', function () {
    console.log('Connected to DB');
});


module.exports = db;