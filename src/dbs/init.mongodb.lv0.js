'use strict';

const mongoose = require('mongoose');
const connectString = `mongodb+srv://galvinnguyen:galvinnguyen123@cluster0.jrk6nh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;  

mongoose.connect(connectString)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log(err);
  })

if (1 === 0) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
