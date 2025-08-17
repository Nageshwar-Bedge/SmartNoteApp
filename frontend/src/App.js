import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const addNote = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase()) ||
      (note.tags &&
        note.tags.join(",").toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-10">
          Smart Notes App
        </h1>
        <SearchBar searchTerm={searchText} setSearchTerm={setSearchText} />
        <NoteForm onNoteCreated={addNote} />
        <NoteList notes={filteredNotes} onDelete={deleteNote} />
      </div>
    </div>
  );
};

export default App;
