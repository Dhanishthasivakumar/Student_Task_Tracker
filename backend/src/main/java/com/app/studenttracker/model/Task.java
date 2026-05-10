package com.app.studenttracker.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED"

    @Column(name = "due_date")
    private LocalDate dueDate;

    // student is EAGER so it loads with the task.
    // @JsonIgnore prevents infinite recursion when serializing to JSON.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"tasks", "attendances", "password"})
    private Student student;

    @Column(name = "completed_at")
    private LocalDate completedAt;

    @Column(nullable = true)
    private String description;

    @Column(nullable = true)
    private String priority; // "Low", "Medium", "High"
}
