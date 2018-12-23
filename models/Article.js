const mongoose = require("mongoose");
const moment = require("moment");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  
  summary: {
    type: String,
    required: false
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true,
    unique: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },

  created: { 
    type : String, 
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  },

  timestamp: {
    type: Date,
    default: Date.now()
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
