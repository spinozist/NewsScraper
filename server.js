var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
mongoose.set ("useCreateIndex", true);


// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");

dotenv.config();

let dbURI = process.env.MongoURI;

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(dbURI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article.css-8atqhb").each(function(i, element) {

        const results = [];
        
        const title = $(element).find("h2").text();
        const summary = $(element).find("p").text() || $(element).find("li").text();
        const link = $(element).find("a").attr("href");

        // Save these results in an object that we'll push into the results array we defined earlier
        db.Article.find({link: link})
            .then(found => {
                if (found.length === 0) {
                results.push({
                    title: title,  
                    summary: summary,
                    link: link
                });

                db.Article.create(results)
                    .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                    })
                    .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                });
            } else {
                console.log("Article is already in the database");
                // console.log(found);
            }
        })          
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles/", function(req, res) {
  db.Article.find({}).sort({timestamp: -1})
  .populate("note")
  .then(found => {
    res.json(found);
  })
  .catch(err => {
    res.json(err);
  })
  // TODO: Finish the route so it grabs all of the articles
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id : req.params.id })
    .populate("note")
    .then(article => {
      res.json(article);
    })
    .catch(err => {
      res.json(err);
    })
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create(req.body)
    .then(note => {
      return db.Article.findOneAndUpdate(
        {_id : req.params.id},
        {note : note._id},
        {new: true}
      )
    })
    .then(article => {
      res.json(article);
    })
    .catch(err => {
      res.json(err)
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
