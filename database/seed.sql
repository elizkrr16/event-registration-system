USE event_registration_system;

INSERT INTO categories (name, description) VALUES
('IT and Development', 'Programming meetups, hackathons and workshops.'),
('Education', 'Open lectures, career guidance and academic events.'),
('Volunteering', 'Social projects and volunteer activities.'),
('Sports', 'Tournaments, challenges and outdoor activities.')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO organizers (full_name, email, password_hash) VALUES
('System Administrator', 'admin@events.local', '$2y$10$wBklWQorrfvtquazGyftCeP6JZTHwwwcRAZRbGsPW2/ibYwoSy8uq')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash);

INSERT INTO students (full_name, email, password_hash, group_name, phone) VALUES
('Ivan Petrov', 'ivan@student.local', '$2y$10$Kt4mE57L9tS6Io0AWk59eeMErnMc5bymm35N35vrL6Fxs4TWsOJda', 'PI-41', '+7-900-111-22-33'),
('Anna Sidorova', 'anna@student.local', '$2y$10$iZlEqYybY87iO5Q1zr6X3ONFdgiKULJQSAoteDo7vtVi5D/zrw9TS', 'IS-32', '+7-900-222-33-44'),
('Sergey Volkov', 'sergey@student.local', '$2y$10$La6F98IwWm3Eo53K9I84ZuRoP3u8xD6LP3pyMOFlQxpIMTskEE5NK', 'KM-21', '+7-900-333-44-55')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), password_hash = VALUES(password_hash), group_name = VALUES(group_name), phone = VALUES(phone);

INSERT INTO events (category_id, organizer_id, title, short_description, description, location, event_date, capacity, status) VALUES
(1, 1, 'Frontend Meetup', 'React meeting with project presentations.', 'Students discuss interface design, component architecture and frontend project cases.', 'Assembly Hall A', '2026-04-10 15:00:00', 60, 'published'),
(2, 1, 'Career Day', 'Meeting with local employers and mentors.', 'A university event with company presentations and internship discussions.', 'Conference Room 2', '2026-04-18 12:00:00', 120, 'published'),
(1, 1, 'Hackathon Weekend', 'Team competition for student web projects.', 'Two-day hackathon focused on solving university service tasks with web technologies.', 'Coworking Center', '2026-05-06 10:00:00', 80, 'published'),
(3, 1, 'Volunteer Forum', 'Projects for city environmental initiatives.', 'Participants choose volunteer projects and build action plans for the season.', 'Student Club', '2026-05-12 14:00:00', 50, 'published'),
(4, 1, 'Spring Sports Cup', 'University mini tournament.', 'A sports event with team registration, schedules and attendance control.', 'Sports Complex', '2026-05-20 11:00:00', 100, 'closed'),
(2, 1, 'Science Poster Session', 'Presentation of graduation research topics.', 'Students present research progress and receive feedback from teachers and peers.', 'Library Hall', '2026-06-01 13:30:00', 40, 'draft'),
(1, 1, 'Backend API Workshop', 'Practical class on REST API design.', 'Workshop on PHP API development, authentication and database interaction.', 'Lab 305', '2026-06-15 16:00:00', 30, 'cancelled');

INSERT INTO registrations (event_id, student_id, status) VALUES
(1, 1, 'registered'),
(1, 2, 'registered'),
(2, 1, 'registered'),
(3, 3, 'registered'),
(5, 2, 'registered')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO attendance (registration_id, is_present) VALUES
(1, 1),
(2, 0),
(5, 1)
ON DUPLICATE KEY UPDATE is_present = VALUES(is_present);
