'use strict';

const mongoose = require('mongoose');
const connectString = ``;  

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
