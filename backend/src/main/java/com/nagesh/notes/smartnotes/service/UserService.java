package com.nagesh.notes.smartnotes.service;

import com.nagesh.notes.smartnotes.model.User;
import com.nagesh.notes.smartnotes.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Register a new user with hashed password
     */
    public User register(User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already registered!");
        });

        userRepository.findByUsername(user.getUsername()).ifPresent(u -> {
            throw new RuntimeException("Username already taken!");
        });

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Validate user login
     */
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return user;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
}