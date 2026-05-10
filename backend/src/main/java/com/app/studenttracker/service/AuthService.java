package com.app.studenttracker.service;

import com.app.studenttracker.dto.LoginRequest;
import com.app.studenttracker.model.Student;
import com.app.studenttracker.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;

    public Student login(LoginRequest loginRequest) {
        Optional<Student> studentOpt = studentRepository.findByEmail(loginRequest.getEmail());
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            // Since security is disabled, doing plain text comparison for now
            if (student.getPassword().equals(loginRequest.getPassword())) {
                return student;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
}
