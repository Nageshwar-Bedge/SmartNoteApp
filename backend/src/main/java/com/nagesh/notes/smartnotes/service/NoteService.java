package com.nagesh.notes.smartnotes.service;

import com.nagesh.notes.smartnotes.model.Note;
import com.nagesh.notes.smartnotes.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepo;

    // Create note
    public Note createNote(Note note) {
        return noteRepo.save(note);
    }

    // Get all notes for a user
    public List<Note> getNotesByUser(String userId) {
        return noteRepo.findByUserId(userId);
    }

    // Get note by ID and user
    public Optional<Note> getNoteByIdAndUser(String id, String userId) {
        return noteRepo.findByIdAndUserId(id, userId);
    }

    // Update note (only if owned by user)
    public Optional<Note> updateNote(String id, Note updatedNote, String userId) {
        return noteRepo.findByIdAndUserId(id, userId).map(existingNote -> {
            if (updatedNote.getTitle() != null) existingNote.setTitle(updatedNote.getTitle());
            if (updatedNote.getContent() != null) existingNote.setContent(updatedNote.getContent());
            if (updatedNote.getTags() != null) existingNote.setTags(updatedNote.getTags());
            if (updatedNote.getReminder() != null) existingNote.setReminder(updatedNote.getReminder());
            return noteRepo.save(existingNote);
        });
    }

    // Delete note (only if owned by user)
    public boolean deleteNote(String id, String userId) {
        return noteRepo.findByIdAndUserId(id, userId).map(note -> {
            noteRepo.delete(note);
            return true;
        }).orElse(false);
    }

    // Get notes by tag for a user
    public List<Note> getNotesByTagAndUser(String tag, String userId) {
        return noteRepo.findByTagsContainingIgnoreCaseAndUserId(tag, userId);
    }

    // Search notes for a user (title, content, tags)
    public List<Note> searchNotesForUser(String keyword, String userId) {
        Set<Note> results = new HashSet<>();

        results.addAll(
                noteRepo.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword)
                        .stream()
                        .filter(note -> note.getUserId().equals(userId))
                        .toList()
        );

        results.addAll(noteRepo.findByTagsContainingIgnoreCaseAndUserId(keyword, userId));

        return new ArrayList<>(results);
    }

    // Get notes by date for a user
    public List<Note> getNotesByDateAndUser(LocalDateTime date, String userId) {
        LocalDateTime start = date.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = date.withHour(23).withMinute(59).withSecond(59);
        return noteRepo.findByCreatedAtBetweenAndUserId(start, end, userId);
    }

    // Toggle pin
    public Optional<Note> togglePin(String id, String userId) {
        return noteRepo.findByIdAndUserId(id, userId).map(note -> {
            note.setPinned(!note.isPinned());
            return noteRepo.save(note);
        });
    }

    // Toggle favorite
    public Optional<Note> toggleFavorite(String id, String userId) {
        return noteRepo.findByIdAndUserId(id, userId).map(note -> {
            note.setFavorite(!note.isFavorite());
            return noteRepo.save(note);
        });
    }

    // Toggle archive
    public Optional<Note> toggleArchive(String id, String userId) {
        return noteRepo.findByIdAndUserId(id, userId).map(note -> {
            note.setArchived(!note.isArchived());
            return noteRepo.save(note);
        });
    }
}
