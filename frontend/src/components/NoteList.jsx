import React from "react";

function NoteList({ notes, onDelete, onEdit, onPin, onFavorite, onArchive, theme, isArchivedView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {notes.map((note) => {
        const noteId = note._id || note.id; // support both online and offline notes
        return (
          <div
            key={noteId}
            className={`p-4 rounded-lg shadow-md border transition-colors duration-300 ${
              theme === "light" ? "bg-white border-gray-200" : "bg-gray-900 border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">{note.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => onPin(noteId)}
                  title={note.pinned ? "Unpin Note" : "Pin Note"}
                  className="hover:scale-110 transition-transform"
                >
                  {note.pinned ? "📌" : "📍"}
                </button>
                <button
                  onClick={() => onFavorite(noteId)}
                  title={note.favorite ? "Remove Favorite" : "Add Favorite"}
                  className="hover:scale-110 transition-transform"
                >
                  {note.favorite ? "❤️" : "🤍"}
                </button>
                <button
                  onClick={() => onArchive(noteId)}
                  title={isArchivedView ? "Unarchive Note" : "Archive Note"}
                  className="hover:scale-110 transition-transform"
                >
                  {isArchivedView ? "📤" : "📤"}
                </button>
                <button
                  onClick={() => onEdit(note)}
                  title="Edit Note"
                  className="hover:scale-110 transition-transform"
                >
                  📝
                </button>
                <button
                  onClick={() => onDelete(noteId)}
                  title="Delete Note"
                  className="hover:scale-110 transition-transform"
                >
                  ❌
                </button>
              </div>
            </div>
            <p className="mt-2">{note.content}</p>
            {note.tags?.length > 0 && (
              <div className="mt-2 text-sm text-gray-500">Tags: {note.tags.join(", ")}</div>
            )}
            {note.reminder && (
              <div className="mt-1 text-sm text-blue-500">
                Reminder: {new Date(note.reminder).toLocaleString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NoteList;
