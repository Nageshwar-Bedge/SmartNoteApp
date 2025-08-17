package com.nagesh.notes.smartnotes.controller;

import com.nagesh.notes.smartnotes.model.Note;
import com.nagesh.notes.smartnotes.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000") // allow React frontend
public class NoteController {

    @Autowired
    private NoteService noteService;

    // Create
    @PostMapping
    public ResponseEntity<Note> create(@RequestBody Note note) {
        return ResponseEntity.ok(noteService.createNote(note));
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<Note>> getAll() {
        return ResponseEntity.ok(noteService.getAllNotes());
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Note>> getById(@PathVariable String id) {
        return ResponseEntity.ok(noteService.getNoteById(id));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<Note> update(@PathVariable String id, @RequestBody Note note) {
        Note updated = noteService.updateNote(id, note);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }

    // Get by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<Note>> getByTag(@PathVariable String tag) {
        return ResponseEntity.ok(noteService.getNotesByTag(tag));
    }

    // Search
    @GetMapping("/search")
    public ResponseEntity<List<Note>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(noteService.searchNotes(keyword));
    }
}
