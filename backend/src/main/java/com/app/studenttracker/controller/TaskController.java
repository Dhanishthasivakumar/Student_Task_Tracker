package com.app.studenttracker.controller;

import com.app.studenttracker.model.Task;
import com.app.studenttracker.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<?> getAllTasks(@RequestHeader("X-User-Role") String role) {
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Access denied: Admin role required");
        }
        return ResponseEntity.ok(taskService.getAllTasks(null));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getTasksByStudentId(
            @PathVariable Long studentId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Id") Long userId) {
        
        // Students can only see their own tasks. Admin can see any student's tasks.
        if ("STUDENT".equals(role) && !userId.equals(studentId)) {
            return ResponseEntity.status(403).body("Access denied: You can only view your own tasks");
        }
        return ResponseEntity.ok(taskService.getTasksByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestParam Long studentId, 
            @RequestBody Task task,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Access denied: Only admins can create tasks");
        }
        return ResponseEntity.ok(taskService.createTask(studentId, task));
    }

    @PutMapping("/{taskId}/complete")
    public ResponseEntity<Task> markTaskAsCompleted(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.markTaskAsCompleted(taskId));
    }

    @PutMapping("/{taskId}/status")
    public ResponseEntity<Task> updateTaskStatus(@PathVariable Long taskId, @RequestParam String status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long taskId, 
            @RequestBody Task taskDetails,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Access denied: Only admins can edit task details");
        }
        return ResponseEntity.ok(taskService.updateTask(taskId, taskDetails));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long taskId,
            @RequestHeader("X-User-Role") String role) {
        
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(403).body("Access denied: Only admins can delete tasks");
        }
        taskService.deleteTask(taskId);
        return ResponseEntity.ok().build();
    }
}
