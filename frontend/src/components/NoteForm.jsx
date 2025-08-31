import React, { useState, useEffect } from "react";
import axios from "axios";

function NoteForm({ onNoteCreated, onNoteUpdated, editingNote, setEditingNote }) {
  const [note, setNote] = useState({
    title: "",
    content: "",
    tags: "",
    reminder: "",
  });

  useEffect(() => {
    if (editingNote) {
      setNote({
        ...editingNote,
        tags: editingNote.tags ? editingNote.tags.join(", ") : "",
      });
    }
  }, [editingNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...note,
      tags: note.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      if (editingNote) {
        const res = await axios.put(
          `http://localhost:8080/api/notes/${editingNote.id}`,
          payload
        );
        onNoteUpdated(res.data);
      } else {
        const res = await axios.post("http://localhost:8080/api/notes", payload);
        onNoteCreated(res.data);
      }
      setNote({ title: "", content: "", tags: "", reminder: "" });
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-md shadow-xl rounded-xl p-6 mb-8 space-y-4 border border-gray-200"
    >
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        required
      />
      <textarea
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
        placeholder="Content"
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        required
      />
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
        placeholder="Tags (comma separated)"
        value={note.tags}
        onChange={(e) => setNote({ ...note, tags: e.target.value })}
      />
      <input
        type="datetime-local"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-sm"
        value={note.reminder}
        onChange={(e) => setNote({ ...note, reminder: e.target.value })}
      />

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 rounded-lg hover:from-blue-700 hover:to-indigo-600 shadow-md transition"
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
