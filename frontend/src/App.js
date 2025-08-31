import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  const loadNotes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Reminder check every 1 min
  useEffect(() => {
    const checkReminders = setInterval(() => {
      notes.forEach((note) => {
        if (note.reminder) {
          const reminderTime = new Date(note.reminder).getTime();
          const now = Date.now();
          if (reminderTime <= now + 60000 && reminderTime > now) {
            alert(`⏰ Reminder: ${note.title}`);
          }
        }
      });
    }, 60000);

    return () => clearInterval(checkReminders);
  }, [notes]);

  const addNote = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const updateNote = (updated) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === updated.id ? updated : n))
    );
    setEditingNote(null);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase()) ||
      (note.tags &&
        note.tags.join(",").toLowerCase().includes(searchText.toLowerCase()));

    const matchesDate =
      !dateFilter ||
      (note.createdAt &&
        new Date(note.createdAt).toISOString().split("T")[0] === dateFilter);

    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-10">
          Smart Notes App
        </h1>

        <SearchBar
          searchTerm={searchText}
          setSearchTerm={setSearchText}
          setDateFilter={setDateFilter}
        />

        <NoteForm
          onNoteCreated={addNote}
          onNoteUpdated={updateNote}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
        />

        <NoteList
          notes={filteredNotes}
          onDelete={deleteNote}
          onEdit={setEditingNote}
        />
      </div>
    </div>
  );
};

export default App;
