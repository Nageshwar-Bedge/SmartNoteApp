package com.nagesh.notes.smartnotes.service;

import com.nagesh.notes.smartnotes.model.Note;
import com.nagesh.notes.smartnotes.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return noteRepo.findByTagsContaining(tag);
    }

    public List<Note> searchNotes(String keyword) {
        return noteRepo.findByTitleContainingIgnoreCase(keyword);
    }
}
