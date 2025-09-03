import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import SearchBar from "./components/SearchBar";
import NoteView from "./components/NoteView";
import Login from "./auth/Login";
import Register from "./auth/Register";
import api from "./services/api";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

// ProtectedRoute component
const ProtectedRoute = ({ token, children }) => (!token ? <Navigate to="/login" replace /> : children);

const App = () => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Load notes (online or offline)
  const loadNotes = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/notes", { headers: { Authorization: `Bearer ${token}` } });
      setNotes(res.data);
    } catch (err) {
      console.warn("Failed to fetch notes online, loading offline notes...");
      const offline = JSON.parse(localStorage.getItem("offlineNotes") || "[]");
      setNotes(offline);
    }
  }, [token]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Save offline notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("offlineNotes", JSON.stringify(notes));
  }, [notes]);

  // Auto-logout if token expired
  useEffect(() => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setToken("");
        toast.error("Session expired. Please login again.");
      }
    } catch {
      localStorage.removeItem("token");
      setToken("");
    }
  }, [token]);

  // Theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Notifications for reminders
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const now = Date.now();
      notes.forEach((note) => {
        if (!note.reminder) return;
        const reminderTime = new Date(note.reminder).getTime();
        if (reminderTime <= now && reminderTime > now - 60000) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("⏰ Reminder", {
              body: `${note.title}\n${note.content}`,
              icon: "/logo192.png",
            });
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [notes, token]);

  // CRUD handlers (support online & offline)
  const addNote = (note) => setNotes((prev) => [...prev, note]);

  const deleteNote = (id) =>
    setNotes((prev) => prev.filter((n) => (n._id || n.id) !== id));

  const updateNote = (updated) => {
    const noteId = updated._id || updated.id;
    setNotes((prev) =>
      prev.map((n) => (n._id === noteId || n.id === noteId ? updated : n))
    );
    setEditingNote(null);
  };

  const togglePin = (id) =>
    setNotes((prev) =>
      prev.map((n) =>
        n._id === id || n.id === id ? { ...n, pinned: !n.pinned } : n
      )
    );

  const toggleFavorite = (id) =>
    setNotes((prev) =>
      prev.map((n) =>
        n._id === id || n.id === id ? { ...n, favorite: !n.favorite } : n
      )
    );

  const toggleArchive = (id) =>
    setNotes((prev) =>
      prev.map((n) =>
        n._id === id || n.id === id ? { ...n, archived: !n.archived } : n
      )
    );

  // Filtered notes for search
  const filteredNotes = notes
    .filter((n) => !n.archived)
    .filter(
      (n) =>
        n.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchText.toLowerCase()) ||
        (n.tags && n.tags.join(",").toLowerCase().includes(searchText.toLowerCase()))
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const archivedNotes = notes.filter((n) => n.archived);

  // Home page with search + form + notes list
  const Home = () => (
    <>
      <SearchBar searchTerm={searchText} setSearchTerm={setSearchText} theme={theme} />

      <NoteForm
        onNoteCreated={addNote}
        onNoteUpdated={updateNote}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        theme={theme}
      />

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
    </>
  );

  return (
    <Router>
      <div
        className={`min-h-screen transition-colors duration-700 ${
          theme === "light"
            ? "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900"
            : "bg-gradient-to-br from-gray-900 via-purple-900 to-black text-gray-100"
        }`}
      >
        <Toaster position="top-right" />
        <div className="max-w-5xl mx-auto p-8">
          {/* Header */}
          <div className="relative flex items-center mb-10">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text animate-gradient-x absolute left-1/2 transform -translate-x-1/2 text-center">
              Smart Notes App
            </h1>

            {/* Buttons */}
            <div className="ml-auto flex gap-4">
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

              {token && (
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setToken("");
                    toast.success("Logged out successfully");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Routes */}
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route
              path="/note/:id"
              element={
                <ProtectedRoute token={token}>
                  <NoteView
                    notes={notes}
                    theme={theme}
                    onEdit={setEditingNote}
                    onArchive={toggleArchive}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <ProtectedRoute token={token}>
                  <Home />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
