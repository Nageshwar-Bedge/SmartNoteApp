import React from "react";
import axios from "axios";

function NoteList({ notes, onDelete }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      onDelete(id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white shadow-lg rounded-xl p-5 border border-gray-200 hover:shadow-2xl transition transform hover:-translate-y-1"
        >
          <h3 className="text-xl font-bold text-blue-700">{note.title}</h3>
          <p className="text-gray-700 mt-2">{note.content}</p>
          <p className="mt-2 text-sm text-gray-500">
            <span className="font-semibold text-purple-600">Tags:</span>{" "}
            {note.tags.join(", ")}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-pink-600">Reminder:</span>{" "}
            {note.reminder}
          </p>
          <button
            onClick={() => handleDelete(note.id)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow transition"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default NoteList;
