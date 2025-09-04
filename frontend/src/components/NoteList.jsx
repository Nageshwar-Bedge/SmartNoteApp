import React, { useState } from "react";

function NoteList({
  notes,
  onDelete,
  onEdit,
  onPin,
  onFavorite,
  onArchive,
  onLock,
  onUnlock,
  onRelock,
  unlockedNotes,
  theme,
  isArchivedView,
}) {
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // for inside-input toggle
  const [actionType, setActionType] = useState(""); // "lock" | "unlock"
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const handleConfirm = () => {
    if (!selectedNoteId) return;
    if (actionType === "lock") {
      onLock(selectedNoteId, password);
    } else if (actionType === "unlock") {
      onUnlock(selectedNoteId, password);
    }
    setPassword("");
    setShowPassword(false);
    setShowPasswordPrompt(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleConfirm();
  };

  return (
    <>
      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => {
          const noteId = note._id || note.id;
          const isUnlocked = unlockedNotes[noteId];

          const fullyLocked = note.locked && !isUnlocked;

          return (
            <div
              key={noteId}
              className={`p-4 rounded-lg shadow-md border transition-colors duration-300 ${
                theme === "light"
                  ? "bg-white border-gray-200"
                  : "bg-gray-900 border-gray-700"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">
                  {fullyLocked ? "🔒 Locked Note" : note.title}
                </h3>
                <div className="flex gap-2">
                  {fullyLocked ? (
                    <button
                      onClick={() => {
                        setSelectedNoteId(noteId);
                        setActionType("unlock");
                        setShowPasswordPrompt(true);
                      }}
                      title="Unlock Note"
                      className="hover:scale-110 transition-transform"
                    >
                      🔓 Unlock
                    </button>
                  ) : note.locked && isUnlocked ? (
                    <button
                      onClick={() => onRelock(noteId)}
                      title="Relock Note"
                      className="hover:scale-110 transition-transform"
                    >
                      🔒
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedNoteId(noteId);
                        setActionType("lock");
                        setShowPasswordPrompt(true);
                      }}
                      title="Lock Note"
                      className="hover:scale-110 transition-transform"
                    >
                      🔐
                    </button>
                  )}

                  {!fullyLocked && (
                    <>
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
                        📤
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
                    </>
                  )}
                </div>
              </div>

              {fullyLocked ? (
                <p className="mt-2 italic text-gray-400">
                  This note is locked. Enter password to unlock.
                </p>
              ) : (
                <>
                  <p className="mt-2">{note.content}</p>
                  {note.tags?.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      Tags: {note.tags.join(", ")}
                    </div>
                  )}
                  {note.reminder && (
                    <div className="mt-1 text-sm text-blue-500">
                      Reminder: {new Date(note.reminder).toLocaleString()}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 rounded-lg shadow-lg w-96 ${
              theme === "light" ? "bg-white text-gray-900" : "bg-gray-800 text-white"
            }`}
          >
            <h2 className="text-lg font-bold mb-4">
              {actionType === "lock" ? "Set Lock Password" : "Enter Unlock Password"}
            </h2>

            {/* Input with inside password toggle */}
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`w-full p-2 pr-10 rounded border ${
                  theme === "light"
                    ? "bg-gray-100 border-gray-300 text-black"
                    : "bg-gray-700 border-gray-600 text-white"
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPassword("");
                  setShowPassword(false);
                }}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteList;
