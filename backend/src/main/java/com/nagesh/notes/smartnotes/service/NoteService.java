package com.nagesh.notes.smartnotes.service;

import com.nagesh.notes.smartnotes.model.Note;
import com.nagesh.notes.smartnotes.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepo;

    public Note createNote(Note note) {
        return noteRepo.save(note);
    }

    public List<Note> getAllNotes() {
        return noteRepo.findAll();
    }

    public Optional<Note> getNoteById(String id) {
        return noteRepo.findById(id);
    }

    public Note updateNote(String id, Note updatedNote) {
        return noteRepo.findById(id).map(existingNote -> {
            existingNote.setTitle(updatedNote.getTitle());
            existingNote.setContent(updatedNote.getContent());
            existingNote.setTags(updatedNote.getTags());
            existingNote.setReminder(updatedNote.getReminder());
            return noteRepo.save(existingNote);
        }).orElse(null);
    }

    public void deleteNote(String id) {
        noteRepo.deleteById(id);
    }

    public List<Note> getNotesByTag(String tag) {
        return noteRepo.findByTagsContainingIgnoreCase(tag);
    }

    public List<Note> searchNotes(String keyword) {
        List<Note> results = noteRepo.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(keyword, keyword);
        results.addAll(noteRepo.findByTagsContainingIgnoreCase(keyword));
        return results;
    }

    public List<Note> getNotesByDate(LocalDateTime date) {
        LocalDateTime start = date.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = date.withHour(23).withMinute(59).withSecond(59);
        return noteRepo.findByCreatedAtBetween(start, end);
    }

    

}
