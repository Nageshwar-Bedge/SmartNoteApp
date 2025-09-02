package com.nagesh.notes.smartnotes.controller;

import com.nagesh.notes.smartnotes.model.Note;
import com.nagesh.notes.smartnotes.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Create note
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Note note,
                                    @AuthenticationPrincipal String userId) {
        try {
            note.setUserId(userId);
            Note saved = noteService.createNote(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get all notes for logged-in user
    @GetMapping
    public ResponseEntity<List<Note>> getAll(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(noteService.getNotesByUser(userId));
    }

    // Get note by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id,
                                     @AuthenticationPrincipal String userId) {
        var optionalNote = noteService.getNoteByIdAndUser(id, userId);
        if (optionalNote.isPresent()) {
            return ResponseEntity.ok(optionalNote.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Note not found"));
        }
    }

    // Update note
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id,
                                    @RequestBody Note note,
                                    @AuthenticationPrincipal String userId) {
        var optionalNote = noteService.updateNote(id, note, userId);
        if (optionalNote.isPresent()) {
            return ResponseEntity.ok(optionalNote.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Note not found or not owned by user"));
        }
    }

    // Delete note
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @AuthenticationPrincipal String userId) {
        boolean deleted = noteService.deleteNote(id, userId);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Note not found or not owned by user"));
        }
        return ResponseEntity.noContent().build();
    }

    // Get notes by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Note>> getByTag(@PathVariable String tag,
                                               @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(noteService.getNotesByTagAndUser(tag, userId));
    }

    // Search notes
    @GetMapping("/search")
    public ResponseEntity<List<Note>> search(@RequestParam String keyword,
                                             @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(noteService.searchNotesForUser(keyword, userId));
    }

    // Get notes by date
    @GetMapping("/date/{date}")
    public ResponseEntity<?> getByDate(@PathVariable String date,
                                       @AuthenticationPrincipal String userId) {
        try {
            LocalDateTime parsedDate;
            if (date.length() == 10) { // format: YYYY-MM-DD
                parsedDate = LocalDate.parse(date).atStartOfDay();
            } else {
                parsedDate = LocalDateTime.parse(date); // expects full timestamp
            }
            return ResponseEntity.ok(noteService.getNotesByDateAndUser(parsedDate, userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:MM"));
        }
    }

    // Toggle pin
    @PutMapping("/{id}/pin")
    public ResponseEntity<?> togglePin(@PathVariable String id,
                                       @AuthenticationPrincipal String userId) {
        var optionalNote = noteService.togglePin(id, userId);
        if (optionalNote.isPresent()) {
            return ResponseEntity.ok(optionalNote.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Note not found or not owned by user"));
        }
    }

    // Toggle favorite
    @PutMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable String id,
                                            @AuthenticationPrincipal String userId) {
        var optionalNote = noteService.toggleFavorite(id, userId);
        if (optionalNote.isPresent()) {
            return ResponseEntity.ok(optionalNote.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Note not found or not owned by user"));
        }
    }

    // Toggle archive
    @PutMapping("/{id}/archive")
    public ResponseEntity<?> toggleArchive(@PathVariable String id,
                                           @AuthenticationPrincipal String userId) {
        var optionalNote = noteService.toggleArchive(id, userId);
        if (optionalNote.isPresent()) {
            return ResponseEntity.ok(optionalNote.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Note not found or not owned by user"));
        }
    }
}
