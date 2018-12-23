// Grab the articles as a json
let numArticles;

$.getJSON("/articles", function (data) {
    // For each one
    data.forEach(data => {
        // Display the apropos information on the page
        if (data.note) {
            $("#articles").append(
                `<div class="card mb-4">
                <div class="card-body">
                    <a href="https://www.nytimes.com${data.link}" target="blank">
                    <h3 class="card-title">${data.title}</h3>
                    </a>
                    <p>${data.summary}</p>
                    <button class="noteButton editButton" data-id=${data._id}>Edit note</button>
                    <small>Scraped: ${data.created}</small>
                </div>
            </div>`
            )
        }
        else {
            $("#articles").append(
                `<div class="card mb-4">
            <div class="card-body">
                <a href="https://www.nytimes.com${data.link}" target="blank">
                <h3 class="card-title">${data.title}</h3>
                </a>
                <p>${data.summary}</p>
                <button class="noteButton" id="button-${data._id}" data-id=${data._id}>Add note</button>
                <small>Scraped: ${data.created}</small>
            </div>
            </div>`
            )
        }
    })
});

$(document).on("click", "button.scrape", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function () {
        location.reload();

    });
})

// Whenever someone clicks a p tag
$(document).on("click", "button.noteButton", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $(`#notes`).append(`<h6 id='note-for'>Note for:</h6><h5 id='note-article'><em>${data.title}</em></h5>`);
            // An input to enter a new title
            $(`#notes`).append(`<input id='titleinput' name='title' placeholder='Title' >`);
            // A textarea to add a new note body
            $(`#notes`).append(`<textarea id='bodyinput' name='body' placeholder='Note'></textarea>`);
            // A button to submit a new note, with the id of the article saved to it
            $(`#notes`).append(`<button data-id="${data._id}" id='savenote'>Save Note</button>`);


            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $(`#titleinput`).val(data.note.title);
                // Place the body of the note in the body textarea
                $(`#bodyinput`).val(data.note.body);

                $(`#notes`).append(`<div id="updated">Last updated:</br>${data.note.updated}</div>`)
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    const thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val(),
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });
    $(`#button-${thisId}`).attr("class", "noteButton editButton")
     .text(`Edit note`);

    $("#notes").empty();
    // Also, remove the values entered in the input and textarea for note entry
    // $("#titleinput").val("");
    // $("#bodyinput").val("");
});
