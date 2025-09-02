import React, { useEffect, useState } from "react";
import api from "../services/api"; // using the axios instance with token
import NoteForm from "./NoteForm";

const NoteList = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err.response?.data || err.message);
    }
  };

  // Delete a note
  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err.response?.data || err.message);
    }
  };

  // Save updated or new note
  const saveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update
        const res = await api.put(`/notes/${editingNote._id}`, noteData);
        setNotes(
          notes.map((note) =>
            note._id === editingNote._id ? res.data : note
          )
        );
        setEditingNote(null);
      } else {
        // Create
        const res = await api.post("/notes", noteData);
        setNotes([...notes, res.data]);
      }
    } catch (err) {
      console.error("Error saving note:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <h2>Your Notes</h2>
      <NoteForm onSave={saveNote} editingNote={editingNote} />
      <ul>
        {notes.map((note) => (
          <li key={note._id} style={{ marginBottom: "15px" }}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            {note.tags && <p><b>Tags:</b> {note.tags.join(", ")}</p>}
            <button onClick={() => setEditingNote(note)}>Edit</button>
            <button onClick={() => deleteNote(note._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
