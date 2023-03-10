

// Instantiate the main variables.
let noteTitle;
let noteText;
let saveNoteButton;
let newNoteButton;
let noteList;
let noteListItems;


// Identify and associate the webpage elements that are necessary for program functionality.
if (window.location.pathname == "/public/notes.html") {
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  saveNoteButton = document.querySelector(".save-note");
  newNoteButton = document.querySelector(".new-note");
  noteList = document.querySelectorAll(".list-container .list-group");
}


// Allow for webpage elements to be displayed/shown depending on current status.
const show = (element) => {
  element.style.display = "inline";
};


// Allow for webpage elements to be hidden depending on current status.
const hide = (element) => {
  element.style.display = "none";
};


// Instantiate the "activeNote" variable that is used to keep track of the note in the text-area.
let activeNote = {};


// Establish the to-server fetch transmission that is for getting/retrieving note records.
const getNotes = () => {
  fetch("/api/notes", {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
     },
    }).then(function (response) {
      if (response.status == 400) {
        //console.log("ERROR: NON-SUCCESSFUL API FETCH-RESPONSE PROCESS." + "\n" +  
        //  "RELATED INFORMATION (IF ANY): " + response.status + "\n");
        //console.log(response);
        // If a fetch/response error occurs...then do not do the data parsing process.
        return;
      }
      return response.json();
  }) .then(function(data) {
    //console.log("getNotes function call: " + "\n" + data);
    renderNoteList(data);
  });
 }


// Establish the to-server fetch transmission that is for posting/adding note records.
const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });


// Establish the to-server fetch transmission that is for deleting note records.
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });


// Process for the current active-focus note.
const renderActiveNote = () => {
  hide(saveNoteButton);
  if (activeNote.id) {
    noteTitle.setAttribute("readonly", true);
    noteText.setAttribute("readonly", true);
    noteTitle.value = activeNote.noteTitle;
    noteText.value = activeNote.noteText;
  } else {
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = "";
    noteText.value = "";
  }
};

// Process for saving the current entered note (at least a title or at least a note body).
const handleNoteSave = () => {
  if (noteTitle.value == "") {
    noteTitle.value = "( NO TITLE )";
  }
  const newNote = {
    noteTitle: noteTitle.value,
    noteText: noteText.value,
  };
  saveNote(newNote).then(() => {
    renderActiveNote();
    getNotes();
  });
};


// Delete the note that had its trashcan icon be clicked.
const handleNoteDelete = (e) => {
  // Prevent the click listener for the list from being called when the button inside of it is 
  // clicked.
  e.stopPropagation();
  const note = e.target;
  //console.log(activeNote);
  activeNote = JSON.parse((note.parentElement).getAttribute("data-note"));
  const noteId = JSON.parse((note.parentElement).getAttribute("data-note")).id;
  //console.log("activeNote.id: " + activeNote.id + "; noteId: " + noteId);
  if (activeNote.id == noteId) {
    if (noteListItems.length == 1) {
      //console.log("BROWSER: The last note is being deleted and being replaced with a '0' ID.");
      activeNote.id = 0;
      activeNote.noteTitle = "No saved notes.";
      activeNote.noteText = "";
      //noteListItems.pop();
      //console.log(noteListItems.length);
    }
    else {
      activeNote = {};
    }
  }
  deleteNote(noteId).then(() => {
    getNotes();
    renderActiveNote();
  });
};


// Set the "activeNote" variable and display it.
const handleNoteView = (e) => {
  const note = e.target;
  e.preventDefault();
  //console.log(note);
  activeNote = JSON.parse((note.parentElement).getAttribute("data-note"));
  //console.log("activeNote.id: " + activeNote.id);
  //console.log(activeNote);
  renderActiveNote();
};


// Set the "activeNote" variable to an empty object and allows the user to enter a new note.
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};


// Additionally process the display aspects of the "Save" button depending on current status.
const handleRenderSaveButton = () => {
  if (((noteTitle.value.trim()) == "") && ((noteText.value.trim() == ""))) {
    hide(saveNoteButton);
  } else {
    show(saveNoteButton);
  }
};


// Render the list of note titles.
async function renderNoteList(notes) {
let jsonNotes = await (notes);
//console.log(window.location.pathname);
if (window.location.pathname == "/public/notes.html") {
  //console.log(jsonNotes);
  //
  // a sub-function that returns a note HTML list-item element with or without a delete button
  function createLi(text, deleteButton = true) {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item");
    const spanElement = document.createElement("span");
    spanElement.classList.add("list-item-title");
    spanElement.textContent = text;
    if (deleteButton) {
      spanElement.addEventListener("click", handleNoteView);
    }
    liElement.append(spanElement);
    //
    if (deleteButton) {
      const deleteButtonElement = document.createElement("i");
      deleteButtonElement.classList.add(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      );
      deleteButtonElement.addEventListener("click", handleNoteDelete);
      liElement.append(deleteButtonElement);
    }
    return liElement;
  };
  //
  noteListItems = [];
  //
  // Mark any empty note list.
  //console.log(jsonNotes.length + " " + jsonNotes[0].id);
  if (jsonNotes.length == 0) {
    noteListItems.push(createLi("No saved notes.", false));
  }
  //
  // Clear any existing note list.
  else if (jsonNotes.length > 0) {
    noteList.forEach((element) => (element.innerHTML = ""));
    //
    // Display the updated/current note list.
    jsonNotes.forEach((note) => {
      if (note.id != 0) {
        const li = createLi(note.noteTitle);
        li.dataset.note = JSON.stringify(note);
        //console.log(li.dataset.note);
        noteListItems.push(li);
      }
      else if ((jsonNotes.length == 1) && (jsonNotes[0].id == 0)) {
        const li = createLi("No saved notes.", false);
        noteListItems.push(li);
      }
    });
    noteListItems.forEach((note) => noteList[0].append(note));
  }
  //
}
}
// Activate the main event listeners/handlers for establishing automatic functionality.
if (window.location.pathname == "/public/notes.html") {
  saveNoteButton.addEventListener("click", handleNoteSave);
  newNoteButton.addEventListener("click", handleNewNoteView);
  noteTitle.addEventListener("keyup", handleRenderSaveButton);
  noteText.addEventListener("keyup", handleRenderSaveButton);
}


// Load and render the starting note list (if any) or the starting empty-list placeholder.
getNotes();

