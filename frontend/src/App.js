import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [theme, setTheme] = useState("dark"); // Dark as default

  const loadNotes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  };

  useEffect(() => { loadNotes(); }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const addNote = (note) => setNotes((prev) => [...prev, note]);
  const deleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const updateNote = (updated) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setEditingNote(null);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.content.toLowerCase().includes(searchText.toLowerCase()) ||
    (note.tags && note.tags.join(",").toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900"
          : "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-100"
      }`}
    >
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient-x">
            Smart Notes App
          </h1>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`px-4 py-2 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 ${
              theme === "light"
                ? "bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white hover:from-indigo-500 hover:to-pink-500"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-gray-100 hover:from-blue-700 hover:to-pink-700"
            }`}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>

        <SearchBar searchTerm={searchText} setSearchTerm={setSearchText} />

        <NoteForm
          onNoteCreated={addNote}
          onNoteUpdated={updateNote}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          theme={theme}
        />

        <NoteList
          notes={filteredNotes}
          onDelete={deleteNote}
          onEdit={setEditingNote}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default App;
