package com.app.studenttracker.service;

import com.app.studenttracker.dto.AdminReportDto;
import com.app.studenttracker.repository.AttendanceRepository;
import com.app.studenttracker.repository.StudentRepository;
import com.app.studenttracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final StudentRepository studentRepository;
    private final TaskRepository taskRepository;
    private final AttendanceRepository attendanceRepository;

    public AdminReportDto getReport() {
        long totalStudents = studentRepository.count();
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.findAll().stream()
                .filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus()))
                .count();
        long totalAttendances = attendanceRepository.count();

        return new AdminReportDto(totalStudents, totalTasks, completedTasks, totalAttendances);
    }
}
