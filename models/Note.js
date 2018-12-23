var mongoose = require("mongoose");
const moment = require("moment");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String,

  updated: { 
    type : String, 
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  },

  timestamp: {
    type: Date,
    default: Date.now()
  }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
