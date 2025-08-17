package com.nagesh.notes.smartnotes.repository;

import com.nagesh.notes.smartnotes.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NoteRepository extends MongoRepository<Note, String> {
    List<Note> findByTagsContaining(String tag);

    List<Note> findByTitleContainingIgnoreCase(String keyword);
}
