package com.nagesh.notes.smartnotes.repository;

import com.nagesh.notes.smartnotes.model.Note;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for managing Note documents in MongoDB.
 * Uses Spring Data MongoDB query derivation.
 */
public interface NoteRepository extends MongoRepository<Note, String> {

    // Search by title (case-insensitive)
    List<Note> findByTitleContainingIgnoreCase(String keyword);

    // Search by title or content (case-insensitive)
    List<Note> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String title, String content);

    // Search notes containing a tag (case-insensitive)
    List<Note> findByTagsContainingIgnoreCase(String tag);

    // Find notes created between two dates
    List<Note> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    // Find pinned notes
    List<Note> findByPinnedTrue();

    // Find archived notes
    List<Note> findByArchivedTrue();

    // Find favorite notes
    List<Note> findByFavoriteTrue();

    // Find notes for a specific user
    List<Note> findByUserId(String userId);

    // Find a note by id and userId (to ensure ownership check)
    Optional<Note> findByIdAndUserId(String id, String userId);

    // Find notes by tag + userId
    List<Note> findByTagsContainingIgnoreCaseAndUserId(String tag, String userId);

    // Find notes by created date range + userId
    List<Note> findByCreatedAtBetweenAndUserId(LocalDateTime start, LocalDateTime end, String userId);

    // 🔹 Additional useful queries:

    // Find pinned notes by user
    List<Note> findByPinnedTrueAndUserId(String userId);

    // Find archived notes by user
    List<Note> findByArchivedTrueAndUserId(String userId);

    // Find favorite notes by user
    List<Note> findByFavoriteTrueAndUserId(String userId);

    // Search by title/content for a specific user
    List<Note> findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
            String userId1, String title, String userId2, String content);
}
