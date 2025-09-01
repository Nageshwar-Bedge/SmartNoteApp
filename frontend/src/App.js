import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [theme, setTheme] = useState("dark"); // default dark

  // Load notes from backend or offline storage
  const loadNotes = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notes");
      setNotes(res.data);
    } catch (error) {
      console.error("Error loading notes:", error);
      const offline = localStorage.getItem("offlineNotes");
      if (offline) {
        try {
          setNotes(JSON.parse(offline));
        } catch {
          console.warn("Failed to parse offline notes");
        }
      }
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("offlineNotes", JSON.stringify(notes));
    } catch {
      console.warn("Failed to save notes offline");
    }
  }, [notes]);

  // Sync offline notes when back online
  useEffect(() => {
    const syncOffline = async () => {
      const offlineNotes = JSON.parse(localStorage.getItem("offlineNotes") || "[]");
      for (const note of offlineNotes) {
        try {
          await axios.post("http://localhost:8080/api/notes", note);
        } catch (err) {
          console.warn("Failed to sync note:", note);
        }
      }
    };
    window.addEventListener("online", syncOffline);
    return () => window.removeEventListener("online", syncOffline);
  }, []);

  // Theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Reminder notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      notes.forEach(note => {
        if (note.reminder) {
          const reminderTime = new Date(note.reminder).getTime();
          if (reminderTime <= now && reminderTime > now - 60000) {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("⏰ Reminder", {
                body: `${note.title}\n${note.content}`,
                icon: "/logo192.png",
              });
            } else {
              alert(`⏰ Reminder: ${note.title}`);
            }
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [notes]);

  // CRUD operations
  const addNote = (note) => setNotes(prev => [...prev, note]);
  const deleteNote = (id) => setNotes(prev => prev.filter(n => n.id !== id));
  const updateNote = (updated) => {
    setNotes(prev => prev.map(n => (n.id === updated.id ? updated : n)));
    setEditingNote(null);
  };

  // Toggle pin/favorite/archive
  const togglePin = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const toggleFavorite = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n));
  const toggleArchive = (id) => setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: !n.archived } : n));

  // Filtered notes for search and pinned sorting
  const filteredNotes = notes
    .filter(n => !n.archived)
    .filter(n =>
      n.title.toLowerCase().includes(searchText.toLowerCase()) ||
      n.content.toLowerCase().includes(searchText.toLowerCase()) ||
      (n.tags && n.tags.join(",").toLowerCase().includes(searchText.toLowerCase()))
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const archivedNotes = notes.filter(n => n.archived);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      theme === "light"
        ? "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900"
        : "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-100"
    }`}>
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex-1 flex justify-center">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient-x">
              Smart Notes App
            </h1>
          </div>
          <div>
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
        </div>

        {/* Search & Form */}
        <SearchBar searchTerm={searchText} setSearchTerm={setSearchText} />
        <NoteForm
          onNoteCreated={addNote}
          onNoteUpdated={updateNote}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          theme={theme}
        />

        {/* Active Notes */}
        <h2 className="text-2xl font-bold mb-4">Notes</h2>
        <NoteList
          notes={filteredNotes}
          onDelete={deleteNote}
          onEdit={setEditingNote}
          onPin={togglePin}
          onFavorite={toggleFavorite}
          onArchive={toggleArchive}
          theme={theme}
          isArchivedView={false}
        />

        {/* Archived Notes */}
        {archivedNotes.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mt-10 mb-4">Archived Notes</h2>
            <NoteList
              notes={archivedNotes}
              onDelete={deleteNote}
              onEdit={setEditingNote}
              onPin={togglePin}
              onFavorite={toggleFavorite}
              onArchive={toggleArchive}
              theme={theme}
              isArchivedView={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
