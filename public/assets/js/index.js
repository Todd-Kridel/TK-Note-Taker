
let noteTitle;
let noteText;
let saveNoteButton;
let newNoteButton;
let noteList;

let sampleReturnData = 
[
  {"id": 1, "noteTitle": "Test Title 1", "noteText": "Test text 1"}, 
  {"id": 2, "noteTitle": "Test Title 2", "noteText": "Test text 2"}, 
  {"id": 3, "noteTitle": "Test Title 3", "noteText": "Test text 3"}
];

if (window.location.pathname === "/public/notes.html") {
  noteTitle = document.querySelector(".note-title");
  noteText = document.querySelector(".note-textarea");
  saveNoteButton = document.querySelector(".save-note");
  newNoteButton = document.querySelector(".new-note");
  noteList = document.querySelectorAll(".list-container .list-group");
}

// Show an element.
const show = (element) => {
  element.style.display = "inline";
};

// Hide an element.
const hide = (element) => {
  element.style.display = "none";
};

// The "activeNote" variable is used to keep track of the note in the textarea.
let activeNote = {};

const getNotes = () => {
  fetch("/api/notes", {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
     },
    }).then(function (response) {
      if (response.status === 400) {
        console.log("ERROR: NON-SUCCESSFUL API FETCH-RESPONSE PROCESS." + "\n" +  
          "RELATED INFORMATION (IF ANY): " + response.status + "\n");
          console.log(response);
          // If a fetch/response error occurs...then do not do the data parsing process.
          return;
      }
      return response.json();
  }) .then(function(data) {
    //console.log("getNotes function call: " + "\n" + data);
    renderNoteList(data);
  });
 }

const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });

const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

const renderActiveNote = () => {
  hide(saveNoteButton);
  if (activeNote.id) {
    noteTitle.setAttribute("readonly", true);
    noteText.setAttribute("readonly", true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = "";
    noteText.value = "";
  }
};

const handleNoteSave = () => {
  if (noteTitle.value == "") {
    noteTitle.value = "<NO TITLE>";
  }
  const newNote = {
    noteTitle: noteTitle.value,
    noteText: noteText.value,
  };
  saveNote(newNote).then(() => {
    getNotes();
    renderActiveNote();
  });
};

// Delete the clicked note.
const handleNoteDelete = (e) => {
  // Prevent the click listener for the list from being called when the button inside of it is 
  // clicked.
  e.stopPropagation();
  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute("li.dataset.note")).id;
  if (activeNote.id === noteId) {
    activeNote = {};
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
  console.log(note);
  activeNote = JSON.parse(e.parentElement);  // getAttribute("li.dataset.note")
  console.log(activeNote);
  renderActiveNote();
};

// Set the "activeNote" variable to an empty object and allows the user to enter a new note.
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

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
console.log(window.location.pathname);
console.log("noteList length: " + noteList.length);
if (window.location.pathname === "/public/notes.html") {
  console.log(jsonNotes);
  //
  // a sub-function that returns a note HTML list-item element with or without a delete button
  function createLi(text, deleteButton = true) {
    const liElement = document.createElement("li");
    liElement.classList.add("list-group-item");
    const spanElement = document.createElement("span");
    spanElement.classList.add("list-item-title");
    spanElement.innerText = text;
    spanElement.addEventListener("click", handleNoteView);
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
  let noteListItems = [];
  //
  // Mark any empty note list.
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi("No saved Notes", false));
  }
  //
  // Clear any existing note list.
  else if (jsonNotes.length > 0) {
    noteList.forEach((el) => (el.innerHTML = ""));
    //
    // Display the updated/current note list.
    jsonNotes.forEach((note) => {
      const li = createLi(note.noteTitle);
      li.dataset.note = JSON.stringify(note);
      //console.log(li.dataset.note);
      noteListItems.push(li);
    });
    noteListItems.forEach((note) => noteList[0].append(note));
  }
  //
}
}

if (window.location.pathname === "/public/notes.html") {
  saveNoteButton.addEventListener("click", handleNoteSave);
  newNoteButton.addEventListener("click", handleNewNoteView);
  noteTitle.addEventListener("keyup", handleRenderSaveButton);
  noteText.addEventListener("keyup", handleRenderSaveButton);
}

getNotes();
