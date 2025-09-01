package com.nagesh.notes.smartnotes.repository;

import com.nagesh.notes.smartnotes.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NoteRepository extends MongoRepository<Note, String> {

    List<Note> findByTitleContainingIgnoreCase(String keyword);

    List<Note> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);

    List<Note> findByTagsContainingIgnoreCase(String tag);

    List<Note> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Note> findByPinnedTrue();

    List<Note> findByArchivedTrue();

    List<Note> findByFavoriteTrue();

}
