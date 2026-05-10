-- ============================================================
-- SEED DATA for Student Tracker
-- Runs on every startup (spring.sql.init.mode=always)
-- Uses INSERT IGNORE so it never duplicates on re-run
-- ============================================================

-- Insert seed students (INSERT IGNORE skips if email already exists via UNIQUE constraint)
INSERT IGNORE INTO students (name, email, password, role)
VALUES ('Default Admin', 'admin@school.com', 'admin123', 'ROLE_ADMIN');

INSERT IGNORE INTO students (name, email, password, role)
VALUES ('Alice Johnson', 'alice@school.com', 'student123', 'ROLE_STUDENT');

INSERT IGNORE INTO students (name, email, password, role)
VALUES ('Bob Smith', 'bob@school.com', 'student123', 'ROLE_STUDENT');

-- Insert seed tasks, referencing the admin student by email (avoids hardcoded IDs)
INSERT IGNORE INTO tasks (title, description, status, priority, due_date, completed_at, student_id)
VALUES (
    'Set up development environment',
    'Install Java, Node.js, and MySQL for the project.',
    'COMPLETED', 'High', '2026-04-01', '2026-04-01',
    (SELECT id FROM students WHERE email = 'admin@school.com')
);

INSERT IGNORE INTO tasks (title, description, status, priority, due_date, completed_at, student_id)
VALUES (
    'Design database schema',
    'Create ER diagram and define all entity relationships.',
    'COMPLETED', 'High', '2026-04-05', '2026-04-05',
    (SELECT id FROM students WHERE email = 'admin@school.com')
);

INSERT IGNORE INTO tasks (title, description, status, priority, due_date, completed_at, student_id)
VALUES (
    'Build REST APIs',
    'Implement all CRUD endpoints using Spring Boot.',
    'IN_PROGRESS', 'High', '2026-04-15', NULL,
    (SELECT id FROM students WHERE email = 'admin@school.com')
);

INSERT IGNORE INTO tasks (title, description, status, priority, due_date, completed_at, student_id)
VALUES (
    'Integrate React frontend',
    'Connect the React application to all backend APIs.',
    'IN_PROGRESS', 'Medium', '2026-04-20', NULL,
    (SELECT id FROM students WHERE email = 'admin@school.com')
);

INSERT IGNORE INTO tasks (title, description, status, priority, due_date, completed_at, student_id)
VALUES (
    'Write unit tests',
    'Cover all service methods with JUnit tests.',
    'PENDING', 'Medium', '2026-04-28', NULL,
    (SELECT id FROM students WHERE email = 'admin@school.com')
);

INSERT IGNORE INTO tasks (title, description, status, priority, due_date, completed_at, student_id)
VALUES (
    'Deploy to production',
    'Host the application on a cloud provider.',
    'PENDING', 'Low', '2026-05-10', NULL,
    (SELECT id FROM students WHERE email = 'admin@school.com')
);
