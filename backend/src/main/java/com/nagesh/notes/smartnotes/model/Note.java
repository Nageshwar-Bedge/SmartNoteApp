package com.nagesh.notes.smartnotes.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    @Id
    private String id;
    private String title;
    private String content;
    private List<String> tags;
    private LocalDateTime reminder;
    private LocalDateTime createdAt = LocalDateTime.now();
}
