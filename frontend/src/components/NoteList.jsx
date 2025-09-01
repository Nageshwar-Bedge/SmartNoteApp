import React from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function NoteList({ notes, onDelete, onEdit, onPin, onFavorite, onArchive, theme, isArchivedView }) {

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
      doc.setFillColor(theme === "light" ? 245 : 50, theme === "light" ? 245 : 50, theme === "light" ? 245 : 50);
      doc.setDrawColor(theme === "light" ? 200 : 80, theme === "light" ? 200 : 80, theme === "light" ? 200 : 80);
      doc.roundedRect(15, y - 5, 180, 60, 3, 3, "FD");

      doc.setTextColor(theme === "light" ? 33 : 220, theme === "light" ? 37 : 220, theme === "light" ? 41 : 220);
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${note.title}`, 20, y + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const splitContent = doc.splitTextToSize(note.content, 170);
      doc.text(splitContent, 20, y + 15);

      if (note.tags?.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(theme === "light" ? 128 : 180, 0, 128);
        doc.text(`Tags: ${note.tags.join(", ")}`, 20, y + 30);
      }

      if (note.reminder) {
        doc.setFontSize(11);
        doc.setTextColor(theme === "light" ? 199 : 255, 21, 133);
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

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert("Note content copied to clipboard!");
  };

  const shareLink = (id) => {
    const url = `${window.location.origin}/note/${id}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div>
      <button
        onClick={exportPDF}
        className="mb-6 px-4 py-2 rounded-lg shadow text-white bg-green-500 hover:bg-green-600 transition duration-200"
      >
        Export to PDF
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        {sortedNotes.map(note => (
          <div
            key={note.id}
            className={`relative rounded-xl p-5 border shadow-lg transform transition-transform duration-300 hover:-translate-y-1 hover:scale-105 ${
              theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3
                className={`text-xl font-bold ${
                  theme === "light"
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
                    : "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
                }`}
              >
                {note.title}
              </h3>

              <div className="flex gap-2">
                {!isArchivedView && (
                  <>
                    <button
                      onClick={() => onPin(note.id)}
                      title={note.pinned ? "Unpin" : "Pin"}
                      className={`p-2 rounded-lg transition duration-200 ${
                        note.pinned ? "bg-yellow-200 text-yellow-800" : theme === "light" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      {note.pinned ? "📌" : "📍"}
                    </button>
                    <button
                      onClick={() => onFavorite(note.id)}
                      title={note.favorite ? "Remove Favorite" : "Favorite"}
                      className={`p-2 rounded-lg transition duration-200 ${
                        note.favorite ? "bg-yellow-400 text-white" : theme === "light" ? "bg-gray-100 text-gray-700" : "bg-gray-700 text-gray-200"
                      }`}
                    >
                      {note.favorite ? "★" : "☆"}
                    </button>
                  </>
                )}

                <button
                  onClick={() => copyToClipboard(note.content)}
                  title="Copy Note"
                  className={`p-2 rounded-lg transition duration-200 ${
                    theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  📋
                </button>

                <button
                  onClick={() => shareLink(note.id)}
                  title="Share Note"
                  className={`p-2 rounded-lg transition duration-200 ${
                    theme === "light" ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  🔗
                </button>

                <button
                  onClick={() => onArchive(note.id)}
                  title={isArchivedView ? "Unarchive" : "Archive"}
                  className={`p-2 rounded-lg transition duration-200 ${
                    isArchivedView
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : theme === "light" ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  {isArchivedView ? "📤" : "🗄️"}
                </button>
              </div>
            </div>

            <p className={theme === "light" ? "text-gray-700 mb-2" : "text-gray-200 mb-2"}>
              {note.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              {note.tags?.map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    theme === "light" ? "bg-purple-100 text-purple-700" : "bg-purple-700 text-purple-100"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {note.reminder && (
              <p className={`text-sm font-semibold ${theme === "light" ? "text-pink-500" : "text-pink-400"}`}>
                ⏰ {note.reminder}
              </p>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(note)}
                className="flex-1 py-2 px-3 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                className="flex-1 py-2 px-3 rounded-lg shadow text-white bg-red-500 hover:bg-red-600 transition duration-200"
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
