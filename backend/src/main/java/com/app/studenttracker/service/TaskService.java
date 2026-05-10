package com.app.studenttracker.service;

import com.app.studenttracker.exception.ResourceNotFoundException;
import com.app.studenttracker.model.Student;
import com.app.studenttracker.model.Task;
import com.app.studenttracker.repository.StudentRepository;
import com.app.studenttracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final StudentRepository studentRepository;

    public Task createTask(Long studentId, Task task) {
        Student student;
        if (studentId != null) {
            student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));
        } else {
            // Auto-assign to the first available student (the seeded default admin)
            student = studentRepository.findAll().stream()
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "No students found in the database. Please ensure the backend started successfully."));
        }
        task.setStudent(student);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(Long studentId) {
        if (studentId != null) {
            return taskRepository.findByStudentId(studentId);
        }
        return taskRepository.findAll();
    }

    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
    }

    public List<Task> getTasksByStudentId(Long studentId) {
        return taskRepository.findByStudentId(studentId);
    }

    public Task updateTask(Long taskId, Task taskDetails) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setPriority(taskDetails.getPriority());
        task.setStatus(taskDetails.getStatus());
        task.setDueDate(taskDetails.getDueDate());
        task.setCompletedAt(taskDetails.getCompletedAt());
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        task.setStatus(status);
        if ("FINISHED".equalsIgnoreCase(status) || "COMPLETED".equalsIgnoreCase(status)) {
            task.setStatus("FINISHED");
            task.setCompletedAt(LocalDate.now());
        } else {
            task.setCompletedAt(null);
        }
        return taskRepository.save(task);
    }

    public Task markTaskAsCompleted(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        task.setStatus("FINISHED");
        task.setCompletedAt(LocalDate.now());
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));
        taskRepository.delete(task);
    }
}
