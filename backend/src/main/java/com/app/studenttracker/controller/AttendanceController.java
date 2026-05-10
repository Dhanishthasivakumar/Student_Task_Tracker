package com.app.studenttracker.controller;

import com.app.studenttracker.model.Attendance;
import com.app.studenttracker.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/attendance", "/api/attendance"})
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark/{studentId}")
    public ResponseEntity<Attendance> markAttendance(@PathVariable Long studentId, @RequestBody Attendance attendance) {
        return ResponseEntity.ok(attendanceService.markAttendance(studentId, attendance));
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudentId(@PathVariable Long id) {
        System.out.println(">>> Backend: Request received for attendance of student_id: " + id);
        List<Attendance> records = attendanceService.getAttendanceByStudentId(id);
        System.out.println(">>> Backend: Returning " + records.size() + " records.");
        return ResponseEntity.ok(records);
    }
}
