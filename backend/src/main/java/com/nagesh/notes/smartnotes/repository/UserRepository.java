package com.nagesh.notes.smartnotes.repository;

import com.nagesh.notes.smartnotes.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    // ✅ Add this to fix UserService
    Optional<User> findByUsername(String username);
}
