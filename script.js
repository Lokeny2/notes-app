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

// RENDER NOTES

function renderNotes(){
    const notes = getNotes();
    const searchTerm = searchInput.value.toLowerCase();

    // Filter Notes Based on Search Term
    const filteredNotes = notes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(searchTerm);
        const contentMatch = note.content.toLowerCase().includes(searchTerm);
        return titleMatch || contentMatch;
    });

    // Clear container
    notesContainer.innerHTML = '';

    // Show Empty Message if no notes
    if(filteredNotes.length === 0){
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'empty-message';
        emptyMsg.textContent = searchTerm ? 'No notes match your search' : 'No notes yet. Write something';
        notesContainer.appendChild(emptyMsg);
        return;
    }

    //Create note cards
    filteredNotes.forEach(note => {
        const card = document.createElement('div')
        card.className = 'note-card';
        // Title
        const title = document.createElement('h3');
        title.textContent = note.title || 'Untitled';
        // content
        const content = document.createElement('p');
        content.textContent = note.content || 'No content';
        // Date
        const date = document.createElement('div');
        date.className = 'note-date';
        date.textContent = new Date(note.timestamp).toLocaleTimeString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
        });
        // Actions container
        const actions = document.createElement('div');
        actions.className = 'note-actions'
        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editNote(note.id));
         // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));

        // Build Card
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(title);
        card.appendChild(content);
        card.appendChild(date);
        card.appendChild(actions);
        notesContainer.appendChild(card);
    })
}

// ADD NOTE

function addNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    
    // Validate input
    if (!title && !content) {
        alert('Please enter a title or content for your note.');
        return;
    }
    
    const notes = getNotes();
    const newNote = {
        id: Date.now(),
        title: title || 'Untitled',
        content: content || 'No content',
        timestamp: Date.now()
    };
    
    notes.unshift(newNote); // Add to beginning of array
    saveNotes(notes);
}

// DELETE NOTE

function deleteNote(id) {
    const notes = getNotes();
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    renderNotes();
}


// EDIT NOTE

function editNote(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    
    if (note) {
        // Fill inputs with note data
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Change button to "Update" temporarily
        const originalText = addBtn.textContent;
        addBtn.textContent = 'Update Note';
        addBtn.style.backgroundColor = '#28a745';
        
        // Store the note id being edited
        addBtn.dataset.editId = id;
        
        // Handle update on click
        const handleUpdate = () => {
            const updatedTitle = noteTitleInput.value.trim();
            const updatedContent = noteContentInput.value.trim();
            
            if (!updatedTitle && !updatedContent) {
                alert('Please enter a title or content.');
                return;
            }
            
            const allNotes = getNotes();
            const noteIndex = allNotes.findIndex(n => n.id === id);
            
            if (noteIndex !== -1) {
                allNotes[noteIndex].title = updatedTitle || 'Untitled';
                allNotes[noteIndex].content = updatedContent || 'No content';
                allNotes[noteIndex].timestamp = Date.now(); // Update timestamp
                saveNotes(allNotes);
            }
            
            // Reset button
            addBtn.textContent = originalText;
            addBtn.style.backgroundColor = '#7e561a';
            delete addBtn.dataset.editId;
            
            // Clear inputs
            noteTitleInput.value = '';
            noteContentInput.value = '';
            
            renderNotes();
            
            // Remove event listener
            addBtn.removeEventListener('click', handleUpdate);
        };
        
        // Replace click handler with update handler
        addBtn.removeEventListener('click', addNote);
        addBtn.addEventListener('click', handleUpdate);
    }
}
