package com.app.studenttracker.config;

import com.app.studenttracker.model.Student;
import com.app.studenttracker.model.Task;
import com.app.studenttracker.repository.AttendanceRepository;
import com.app.studenttracker.repository.StudentRepository;
import com.app.studenttracker.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final TaskRepository taskRepository;
    private final AttendanceRepository attendanceRepository;

    @Override
    public void run(String... args) {
        Student adminUser;
        // Seed the specific admin user if it doesn't exist
        var adminOpt = studentRepository.findByEmail("admin@school.com");
        if (adminOpt.isEmpty()) {
            System.out.println(">>> DataInitializer: Creating strict admin user...");
            adminUser = new Student();
            adminUser.setName("System Admin");
            adminUser.setEmail("admin@school.com");
            adminUser.setPassword("admin");
            adminUser.setRole("ADMIN");
            adminUser = studentRepository.save(adminUser);
        } else {
            adminUser = adminOpt.get();
        }

        // Seed sample data if students or attendance are missing
        if (studentRepository.count() <= 1 || attendanceRepository.count() == 0) {
            System.out.println(">>> DataInitializer: Seeding sample data (Students or Attendance missing)...");
            seedData(adminUser);
        } else {
            System.out.println(">>> DataInitializer: Data already exists, skipping seed.");
        }
    }

    private void seedData(Student adminUser) {
        // Create sample students if they don't exist
        Student alice = studentRepository.findByEmail("alice@school.com")
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setName("Alice Johnson");
                    s.setEmail("alice@school.com");
                    s.setPassword("student123");
                    s.setRole("STUDENT");
                    return studentRepository.save(s);
                });

        Student bob = studentRepository.findByEmail("bob@school.com")
                .orElseGet(() -> {
                    Student s = new Student();
                    s.setName("Bob Smith");
                    s.setEmail("bob@school.com");
                    s.setPassword("student123");
                    s.setRole("STUDENT");
                    return studentRepository.save(s);
                });

        // Seed tasks linked to the admin student if tasks are empty
        if (taskRepository.count() == 0) {
            createTask(adminUser, "Set up development environment",
                    "Install Java, Node.js, and MySQL for the project.",
                    "COMPLETED", "High", LocalDate.of(2026, 4, 1), LocalDate.of(2026, 4, 1));

            createTask(adminUser, "Design database schema",
                    "Create ER diagram and define all entity relationships.",
                    "COMPLETED", "High", LocalDate.of(2026, 4, 5), LocalDate.of(2026, 4, 5));
        }

        // Always seed attendance if empty
        if (attendanceRepository.count() == 0) {
            markAttendance(alice, LocalDate.now().minusDays(2), 100);
            markAttendance(alice, LocalDate.now().minusDays(1), 100);
            markAttendance(alice, LocalDate.now(), 100);

            markAttendance(bob, LocalDate.now().minusDays(2), 100);
            markAttendance(bob, LocalDate.now().minusDays(1), 0);
            markAttendance(bob, LocalDate.now(), 100);
        }

        System.out.println(">>> DataInitializer: Successfully seeded " +
                taskRepository.count() + " tasks and " +
                studentRepository.count() + " students.");
    }

    private void markAttendance(Student student, LocalDate date, Integer attendanceValue) {
        com.app.studenttracker.model.Attendance attendance = new com.app.studenttracker.model.Attendance();
        attendance.setStudent(student);
        attendance.setDate(date);
        attendance.setAttendance(attendanceValue);
        attendanceRepository.save(attendance);
    }

    private void createTask(Student student, String title, String description,
                            String status, String priority,
                            LocalDate dueDate, LocalDate completedAt) {
        Task task = new Task();
        task.setStudent(student);
        task.setTitle(title);
        task.setDescription(description);
        task.setStatus(status);
        task.setPriority(priority);
        task.setDueDate(dueDate);
        task.setCompletedAt(completedAt);
        taskRepository.save(task);
    }
}
