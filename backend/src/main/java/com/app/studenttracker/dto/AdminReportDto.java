package com.app.studenttracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReportDto {
    private long totalStudents;
    private long totalTasks;
    private long completedTasks;
    private long totalAttendances;
}
