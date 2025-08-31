// NoteList.jsx
import React from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function NoteList({ notes, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`);
      onDelete(id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const exportPDF = () => {
    if (!Array.isArray(notes) || notes.length === 0) {
      alert("No notes available to export.");
      return;
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Smart Notes Report", 105, 15, { align: "center" });

    let y = 30;

    notes.forEach((note, index) => {
      // Card background
      doc.setFillColor(245, 245, 245); // light gray
      doc.setDrawColor(200, 200, 200); // border color
      doc.roundedRect(15, y - 5, 180, 60, 3, 3, "FD");

      // Title
      doc.setTextColor(33, 37, 41);
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${note.title}`, 20, y + 5);

      // Content (wrapped text)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(note.content, 170);
      doc.text(splitContent, 20, y + 15);

      // Tags
      if (note.tags?.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(128, 0, 128); // purple
        doc.text(`Tags: ${note.tags.join(", ")}`, 20, y + 30);
      }

      // Reminder
      if (note.reminder) {
        doc.setFontSize(11);
        doc.setTextColor(199, 21, 133); // pink
        doc.text(`Reminder: ${note.reminder}`, 20, y + 40);
      }

      y += 70;

      if (y > 250 && index !== notes.length - 1) {
        doc.addPage();
        y = 30;
      }
    });

    doc.save("notes-report.pdf");
  };

  return (
    <div>
      <button
        onClick={exportPDF}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow"
      >
        Export to PDF
      </button>

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

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(note)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NoteList;
