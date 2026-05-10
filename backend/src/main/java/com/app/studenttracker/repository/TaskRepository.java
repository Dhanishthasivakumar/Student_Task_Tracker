package com.app.studenttracker.repository;

import com.app.studenttracker.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStudent_Id(Long studentId);
    List<Task> findByStudentId(Long studentId);
}
