package com.app.studenttracker.service;

import com.app.studenttracker.model.Attendance;
import com.app.studenttracker.model.Student;
import com.app.studenttracker.model.Task;
import com.app.studenttracker.repository.AttendanceRepository;
import com.app.studenttracker.repository.StudentRepository;
import com.app.studenttracker.repository.TaskRepository;
import org.springframework.stereotype.Service;


import java.time.temporal.IsoFields;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TaskRepository taskRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AnalyticsService(TaskRepository taskRepository, AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.taskRepository = taskRepository;
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public double calculateProductivity(Long studentId) {
        List<Task> tasks = taskRepository.findByStudent_Id(studentId);
        List<Attendance> attendances = attendanceRepository.findByStudent_Id(studentId);

        return calculateProductivityScore(tasks, attendances);
    }

    private double calculateProductivityScore(List<Task> tasks, List<Attendance> attendances) {
        double taskCompletionRate = 0.0;
        if (!tasks.isEmpty()) {
            long completedTasks = tasks.stream()
                    .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()) || "FINISHED".equalsIgnoreCase(t.getStatus()))
                    .count();
            taskCompletionRate = ((double) completedTasks / tasks.size()) * 100.0;
        }

        double attendanceRate = 0.0;
        if (!attendances.isEmpty()) {
            attendanceRate = attendances.stream()
                    .mapToDouble(Attendance::getAttendance)
                    .average()
                    .orElse(0.0);
        }

        // Weight: 60% task completion, 40% attendance rate (0-100 scale)
        double score = (0.6 * taskCompletionRate) + (0.4 * attendanceRate);
        return Math.round(score * 100.0) / 100.0; // round to 2 decimal places
    }

    public Map<String, Integer> getWeeklyTrend(Long studentId) {
        List<Task> tasks = taskRepository.findByStudent_Id(studentId);
        
        Map<String, Integer> weeklyTrend = new TreeMap<>();
        
        tasks.stream()
                .filter(t -> ("COMPLETED".equalsIgnoreCase(t.getStatus()) || "FINISHED".equalsIgnoreCase(t.getStatus())) && t.getCompletedAt() != null)
                .forEach(t -> {
                    int week = t.getCompletedAt().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
                    int year = t.getCompletedAt().getYear();
                    String weekKey = year + "-W" + String.format("%02d", week);
                    
                    weeklyTrend.put(weekKey, weeklyTrend.getOrDefault(weekKey, 0) + 1);
                });
                
        return weeklyTrend;
    }

    public String categorizeStudent(double score) {
        if (score > 75.0) {
            return "High Performer";
        } else if (score >= 50.0) {
            return "Average";
        } else {
            return "At Risk";
        }
    }

    public List<Map<String, Object>> getAdminDashboard() {
        List<Student> students = studentRepository.findAll();
        
        return students.stream()
                .filter(s -> "ROLE_STUDENT".equals(s.getRole()))
                .map(s -> {
                    List<Task> tasks = taskRepository.findByStudent_Id(s.getId());
                    List<Attendance> attendances = attendanceRepository.findByStudent_Id(s.getId());
                    
                    double score = calculateProductivityScore(tasks, attendances);
                    String category = categorizeStudent(score);
                    
                    Map<String, Object> result = new HashMap<>();
                    result.put("id", s.getId());
                    result.put("name", s.getName());
                    result.put("score", score);
                    result.put("category", category);
                    return result;
                })
                .collect(Collectors.toList());
    }

    // Phase 5: Basic Prediction mimicking Logistic Regression
    public int predictRisk(Long studentId) {
        List<Task> tasks = taskRepository.findByStudent_Id(studentId);
        List<Attendance> attendances = attendanceRepository.findByStudent_Id(studentId);

        double taskCompletionRate = 0.0;
        if (!tasks.isEmpty()) {
            long completedTasks = tasks.stream()
                    .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()) || "FINISHED".equalsIgnoreCase(t.getStatus()))
                    .count();
            taskCompletionRate = (double) completedTasks / tasks.size();
        }

        double attendanceRate = 0.0;
        if (!attendances.isEmpty()) {
            attendanceRate = attendances.stream()
                    .mapToDouble(Attendance::getAttendance)
                    .average()
                    .orElse(0.0) / 100.0; // convert back to 0-1 for prediction logic
        }

        // Mimicking a basic trained model weights for risk
        // if completion < 50% and attendance < 60%, they are at risk (1) else (0)
        double riskScore = (0.7 * (1.0 - taskCompletionRate)) + (0.3 * (1.0 - attendanceRate));
        return riskScore > 0.45 ? 1 : 0;
    }
}
