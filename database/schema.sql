CREATE DATABASE IF NOT EXISTS event_registration_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE event_registration_system;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS organizers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE organizers (
    organizer_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT DEFAULT NULL
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    short_description VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(120) NOT NULL,
    location VARCHAR(200) NOT NULL,
    format ENUM('online', 'offline', 'hybrid') NOT NULL DEFAULT 'offline',
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    capacity INT NOT NULL,
    status ENUM('draft', 'published', 'closed', 'cancelled') NOT NULL DEFAULT 'draft',
    program TEXT DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES organizers(organizer_id),
    CONSTRAINT fk_events_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    student_id INT NOT NULL,
    status ENUM('registered', 'cancelled') NOT NULL DEFAULT 'registered',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(event_id),
    CONSTRAINT fk_registrations_student FOREIGN KEY (student_id) REFERENCES students(student_id),
    CONSTRAINT uq_registrations_event_student UNIQUE (event_id, student_id)
);

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    registration_id INT NOT NULL UNIQUE,
    check_in_at DATETIME DEFAULT NULL,
    method VARCHAR(50) DEFAULT NULL,
    CONSTRAINT fk_attendance_registration FOREIGN KEY (registration_id) REFERENCES registrations(registration_id)
);
