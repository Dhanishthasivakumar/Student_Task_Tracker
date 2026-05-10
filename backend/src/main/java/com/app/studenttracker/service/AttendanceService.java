package com.app.studenttracker.service;

import com.app.studenttracker.exception.ResourceNotFoundException;
import com.app.studenttracker.model.Attendance;
import com.app.studenttracker.model.Student;
import com.app.studenttracker.repository.AttendanceRepository;
import com.app.studenttracker.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public Attendance markAttendance(Long studentId, Attendance attendance) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + studentId));
        attendance.setStudent(student);
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudent_Id(studentId);
    }
}
