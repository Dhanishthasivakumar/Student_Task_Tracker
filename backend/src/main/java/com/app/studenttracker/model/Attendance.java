package com.app.studenttracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "attendance", nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("attendance")
    private Integer attendance; // Stores 0 or 1 or percentage

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("student_id")
    @com.fasterxml.jackson.annotation.JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @com.fasterxml.jackson.annotation.JsonIdentityReference(alwaysAsId = true)
    private Student student;
}
