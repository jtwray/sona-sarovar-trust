const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PicSchema = new Schema({
  url: {
    type: String,
    required: true
  }
}, {
  usePushEach: true
});

module.exports = PicSchema;
