// References to HTML Elements
const searchInput = document.getElementById('searchInput');
const noteTitleInput = document.getElementById('noteTitle');
const noteContentInput = document.getElementById('noteContent');
const addBtn = document.getElementById('addBtn');
const notesContainer = document.getElementById('notesContainer');

// Local Storage
function getNotes(){
    const notes = localStorage.getItem('notes')
    return notes ? JSON.parse(notes) : [];
}

function saveNotes(notes){
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Render Notes
function renderNotes(){
    const notes = getNotes();
    const searchTerm = searchInput.value.toLowerCase();
}