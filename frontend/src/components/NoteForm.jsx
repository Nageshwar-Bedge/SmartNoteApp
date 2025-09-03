import React, { useState, useEffect } from "react";
import api from "../services/api"; // Centralized API

function NoteForm({ onNoteCreated, onNoteUpdated, editingNote, setEditingNote, theme }) {
  const [note, setNote] = useState({ title: "", content: "", tags: "", reminder: "" });
  const [isSavingOffline, setIsSavingOffline] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (editingNote) {
      setNote({
        ...editingNote,
        tags: editingNote.tags ? editingNote.tags.join(", ") : "",
        reminder: editingNote.reminder || "",
      });
    }
  }, [editingNote]);

  // Save note offline
  const saveOffline = (payload) => {
    setIsSavingOffline(true);
    const offlineNotes = JSON.parse(localStorage.getItem("offlineNotes") || "[]");

    if (editingNote) {
      const updatedNotes = offlineNotes.map((n) => (n.id === editingNote.id ? payload : n));
      localStorage.setItem("offlineNotes", JSON.stringify(updatedNotes));
    } else {
      payload.id = `offline-${Date.now()}`;
      localStorage.setItem("offlineNotes", JSON.stringify([...offlineNotes, payload]));
    }

    setIsSavingOffline(false);
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...note,
      tags: note.tags ? note.tags.split(",").map((t) => t.trim()) : [],
    };

    try {
      if (navigator.onLine) {
        // Online mode: create or update via API
        if (editingNote) {
          const res = await api.put(`/notes/${editingNote.id}`, payload);
          onNoteUpdated(res.data);
        } else {
          const res = await api.post("/notes", payload);
          onNoteCreated(res.data);
        }
      } else {
        // Offline mode
        const offlineNote = saveOffline(payload);
        if (editingNote) onNoteUpdated(offlineNote);
        else onNoteCreated(offlineNote);
        alert("You are offline. Note saved locally and will sync when back online.");
      }

      // Reset form
      setNote({ title: "", content: "", tags: "", reminder: "" });
      setEditingNote(null);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  const inputClasses = `w-full p-3 border rounded-lg shadow-sm focus:ring-2 ${
    theme === "light"
      ? "focus:ring-pink-400 border-gray-300 bg-white text-gray-900"
      : "focus:ring-indigo-400 border-gray-600 bg-gray-900 text-gray-100"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl p-6 mb-8 space-y-4 shadow-xl border ${
        theme === "light" ? "bg-white/90 border-gray-200" : "bg-gray-800 border-gray-700"
      }`}
    >
      <input
        className={inputClasses}
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        required
      />
      <textarea
        className={inputClasses}
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        required
      />
      <input
        className={inputClasses}
        placeholder="Tags (comma separated)"
        value={note.tags}
        onChange={(e) => setNote({ ...note, tags: e.target.value })}
      />
      <input
        type="datetime-local"
        className={inputClasses}
        value={note.reminder}
        onChange={(e) => setNote({ ...note, reminder: e.target.value })}
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 py-2 rounded-lg shadow-md text-white transition bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600"
          disabled={isSavingOffline}
        >
          {editingNote ? "Update Note" : "Save Note"}
        </button>

        {editingNote && (
          <button
            type="button"
            onClick={() => {
              setEditingNote(null);
              setNote({ title: "", content: "", tags: "", reminder: "" });
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;
