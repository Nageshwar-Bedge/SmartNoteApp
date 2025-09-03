import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function NoteView({ notes, onEdit, onArchive, theme }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find note using _id (online) or id (offline)
  const note = notes.find((n) => (n._id || n.id).toString() === id);

  if (!note) {
    return (
      <p
        className={`text-center mt-10 ${
          theme === "light" ? "text-gray-700" : "text-gray-300"
        }`}
      >
        Note not found!
      </p>
    );
  }

  const copyToClipboard = async (content) => {
    if (!content) return toast.error("No content to copy!");
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Note content copied!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy content.");
    }
  };

  const shareLink = async (note) => {
    const noteKey = note._id || note.id;
    const url = `${window.location.origin}/note/${noteKey}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Shareable link copied!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div
      className={`p-8 max-w-3xl mx-auto rounded-xl shadow-lg mt-10 transition-colors duration-500 ${
        theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">{note.title || "Untitled Note"}</h1>
      <p className="mb-4">{note.content || "No content available."}</p>

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                theme === "light"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-purple-700 text-purple-100"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {note.reminder && (
        <p className={`mb-4 ${theme === "light" ? "text-pink-500" : "text-pink-400"}`}>
          ⏰ {note.reminder}
        </p>
      )}

      <div className="flex gap-3 mt-4 flex-wrap">
        {/* Go Back always redirects to home */}
        <button
          onClick={() => navigate("/", { replace: true })}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          Go Back
        </button>

        <button
          onClick={() => onEdit(note)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onArchive(note)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          {note.archived ? "Unarchive" : "Archive"}
        </button>

        <button
          onClick={() => copyToClipboard(note.content)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Copy
        </button>

        <button
          onClick={() => shareLink(note)}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
        >
          Share
        </button>
      </div>
    </div>
  );
}

export default NoteView;
