const express = require("express");
const path = require("path");
const fs = require("fs");
// const noteData = require("./db/db.json");
// const { response } = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
//const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

let theFileData;
let lastNoteID;

newNoteData = 
  {
      "id": 0, 
      "noteTitle": "",
      "noteText": ""
  };

// The following HTML routes should be created:

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// a route to allow for the loading of the "favicon.ico" file
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/favicon.ico"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/index/html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/public", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // console.info(`${req.method} request received to get notes`);
  // res.json(`${req.method} request received to get notes`);
});
app.get("/public/index", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // console.info(`${req.method} request received to get notes`);
  // res.json(`${req.method} request received to get notes`);
});

app.get("/public/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // console.info(`${req.method} request received to get notes`);
  // res.json(`${req.method} request received to get notes`);
});

// GET /notes should return the notes.html file.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  //res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// a route to allow for the loading of the "notes.html" file
app.get("/notes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// a route to allow for the loading of the "favicon.ico" file
app.get("/public/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/favicon.ico"));
});

app.get("/public/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  // console.info(`${req.method} request received to get notes`);
  // res.json(`${req.method} request received to get notes`);
});

app.get("/public/notes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  // console.info(`${req.method} request received to get notes`);
  // res.json(`${req.method} request received to get notes`);
});

// a route to allow for the loading of the "/assets/js/index.js" file
app.get("/assets/js/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

// a route to allow for the loading of the "/assets/css/styles.css" file
app.get("/assets/css/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
});

// a route to allow for the loading of the "/assets/css/styles.css" file
app.get("/public/assets/css/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
});

// a route to allow for the loading of the "/assets/js/index.js" file
app.get("/public/assets/js/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
});

// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON.
// GET route for getting all of the notes
app.get("/api/notes", (req, res) => {
  //res.json(noteData);
  doReadFromTheDBFile();  // for the synchronous read function
  res.json(theFileData);  // for the synchronous read function
});

// GET request for any other URL paths -- a fallback route
// GET * should return the index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// The following API routes should be created:

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
// POST request to add a review
app.post("/api/notes", (req, res) => {
  //console.info(`${req.method} request received to add a note`);

  newNoteData.id = (lastNoteID + 1);
  newNoteData.noteTitle  = req.body.noteTitle;
  newNoteData.noteText = req.body.noteText

  //console.log("ID: " + newNoteData.id + "; noteTitle: " + newNoteData.noteTitle + 
  //  "; noteText: " + newNoteData.noteText);

  theFileData.push(newNoteData);
  doWriteToTheDBFile();
  //console.log(`The new note \"${newNoteData.title}\"` + 
  //  ` has been written to the Note database JSON file.`);
  res.json(newNoteData);
});

// POST request for any other URL paths -- a fallback route
// POST * should return the index.html file.
app.post("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Bonus
// DELETE requests: This application has that functionality in the front end. 
// As a bonus...add the DELETE route to the application using the following guideline:
// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.

// GET route that returns any specific note
app.delete("/api/notes/:id", (req, res) => {
let deleteNoteID = req.params.id;
let aDeletionRecordWasFound = false;
let deletionNote;
let deletionNoteJSON;
//console.log("deleteNoteID: " + deleteNoteID);
for (let loopIndex = 0; loopIndex < theFileData.length; loopIndex++) {
  //console.log("data ID test: " + theFileData[loopIndex].id);
  if (theFileData[loopIndex].id == deleteNoteID) {
    deletionNote = JSON.stringify(theFileData[loopIndex]);
    deletionNoteJSON = theFileData[loopIndex];
    //console.log("The indicated deletion record was found and deleted (ID = " + 
    //  deleteNoteID + ")." + "\n" + deletionNote);
    aDeletionRecordWasFound = true;
    if ((loopIndex == 0) && (loopIndex == (theFileData.length - 1))) {
      theFileData[0] = {"id": 0, "noteTitle": "", "noteText": ""};
    //  console.log("SERVER: The last note is being deleted and being replaced with a '0' ID.");
    }
    else {
      theFileData.splice(loopIndex, 1);
    }
    doWriteToTheDBFile();
  }
}
if (aDeletionRecordWasFound == true) {
  res.json(deletionNoteJSON);
}
else {
  res.json("The requested note was not found (ID = " + deleteNoteID + ").");
}
});

// Activate the server for listening for URL connections.
app.listen(PORT, () =>
  console.info(`The Note-Taker app server is listening at http://localhost:${PORT}.`)
);

// DELETED request for any other URL paths -- a fallback route
// DELETE * should return the index.html file.
app.delete("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


function doReadFromTheDBFile() {
// Read from the note database file.

// synchronous option
theFileData = JSON.parse(fs.readFileSync("./db/db.json"));
lastNoteID = ((theFileData[(theFileData.length) - 1].id));
//console.log("Note data has been read from the Note database JSON file.");

// asynchronous option
// fs.readFile("./db/db.json", "utf-8", function (err, data) {
//   if (err) {
//     throw err;
//   }
//   else if (data) {
//     console.log(data);
//     theFileData = JSON.parse(data);
//     console.log(`Note data has been read from the Note database JSON file.`);
//     lastNoteID = (theFileData.length);
//     console.log(lastNoteID);
//   }
// });
}
   

function doWriteToTheDBFile() {
// Write to the note database file.

// synchronous option
fs.writeFileSync("./db/db.json", JSON.stringify(theFileData));
lastNoteID = ((theFileData[(theFileData.length) - 1].id));
//console.log("The Note database JSON file has been updated.");

// asynchronous option
// fs.writeFile("./db/db.json", JSON.stringify(theFileData), function (err, data) {
//   if (err) {
//     throw err;
//   }
//   else {
//     console.log(`The Note database JSON file has been updated.`);
//   }
// });
}

