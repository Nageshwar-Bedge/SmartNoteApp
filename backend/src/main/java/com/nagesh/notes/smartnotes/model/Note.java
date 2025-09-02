package com.nagesh.notes.smartnotes.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    private String id;

    @Indexed
    private String userId; // Reference to User

    private String title;
    private String content;

    @Builder.Default
    private List<String> tags = List.of();

    private LocalDateTime reminder;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder.Default
    @Indexed
    private boolean pinned = false;

    @Builder.Default
    @Indexed
    private boolean favorite = false;

    @Builder.Default
    @Indexed
    private boolean archived = false;

    private LocalDateTime deletedAt; // Soft delete support
}
