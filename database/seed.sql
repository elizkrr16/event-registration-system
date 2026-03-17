USE event_registration_system;

INSERT INTO categories (category_id, name, description) VALUES
(1, 'Конференции', 'Образовательные и профессиональные конференции.'),
(2, 'Мастер-классы', 'Практические занятия и прикладные интенсивы.'),
(3, 'Волонтерство', 'Городские и социальные инициативы.'),
(4, 'Спорт', 'Соревнования и спортивные активности.'),
(5, 'Карьера', 'Ярмарки вакансий и встречи с работодателями.')
ON DUPLICATE KEY UPDATE
name = VALUES(name),
description = VALUES(description);

INSERT INTO organizers (organizer_id, full_name, email, phone, password_hash) VALUES
(1, 'Администратор НаВстречу', 'admin@navstrechu.local', '+7-900-100-00-01', '$2y$10$ZNvQ6sll2CG7wwNNs4brjeYCVgLvmOD6h4Z6V6CrshaZ9dhZxTdj2')
ON DUPLICATE KEY UPDATE
full_name = VALUES(full_name),
phone = VALUES(phone),
password_hash = VALUES(password_hash);

INSERT INTO students (student_id, full_name, email, phone, password_hash) VALUES
(1, 'Иван Петров', 'ivan@student.local', '+7-900-111-22-33', '$2y$10$kFh16Sg1k4kjwfBN.qAs0.cbw3Kauwc8Dh0kQQTSGta0elANmKS4S'),
(2, 'Анна Сидорова', 'anna@student.local', '+7-900-222-33-44', '$2y$10$36oYgrQEZQt03TFSclmtMe/5jARjJnFvtEjzvsWeK0oDzgLvB84BW'),
(3, 'Сергей Волков', 'sergey@student.local', '+7-900-333-44-55', '$2y$10$5VJ6ivlXDelqb15nCts6q.ym4jZGsAPGcIlBhL0QJVWRQ2arexJIq')
ON DUPLICATE KEY UPDATE
full_name = VALUES(full_name),
phone = VALUES(phone),
password_hash = VALUES(password_hash);

INSERT INTO events (
    event_id, organizer_id, category_id, title, short_description, description, city, location,
    format, starts_at, ends_at, capacity, status, program, image_url
) VALUES
(1, 1, 1, 'Форум студенческих проектов', 'Презентация лучших цифровых инициатив университета.', 'На мероприятии команды показывают дипломные и учебные веб-проекты, обсуждают архитектуру, интерфейсы и пользовательские сценарии.', 'Красноярск', 'Главный конференц-зал, корпус А', 'offline', '2026-04-12 11:00:00', '2026-04-12 15:00:00', 80, 'published', '11:00 — открытие; 12:00 — презентации; 14:00 — разбор проектов; 14:40 — награждение.', NULL),
(2, 1, 2, 'React-практикум для начинающих', 'Практическая работа по интерфейсам и маршрутизации.', 'Участники собирают клиентскую часть учебного сервиса, работают с формами, роутингом и компонентной архитектурой.', 'Красноярск', 'Лаборатория 305', 'offline', '2026-04-18 13:00:00', '2026-04-18 17:00:00', 25, 'published', '13:00 — вводная часть; 14:00 — компоненты; 15:30 — формы; 16:30 — вопросы.', NULL),
(3, 1, 5, 'День карьеры IT-направлений', 'Встреча студентов с работодателями и HR-специалистами.', 'Компании рассказывают о стажировках, карьерных траекториях и требованиях к junior-разработчикам.', 'Красноярск', 'Онлайн-трансляция + актовый зал', 'hybrid', '2026-04-24 12:00:00', '2026-04-24 16:00:00', 120, 'published', '12:00 — открытие; 12:30 — выступления компаний; 14:30 — Q&A; 15:30 — консультации.', NULL),
(4, 1, 3, 'Городская волонтерская встреча', 'Набор участников в социальные и экологические проекты.', 'Площадка для координации волонтерских команд, выбора задач и записи в проекты на май-июнь.', 'Красноярск', 'Молодежный центр "Спектр"', 'offline', '2026-05-05 14:00:00', '2026-05-05 17:00:00', 60, 'published', '14:00 — знакомство; 14:30 — презентация инициатив; 15:30 — запись в команды.', NULL),
(5, 1, 4, 'Весенний кубок факультета', 'Командный спортивный турнир.', 'Соревнование между студенческими командами с контролем регистраций и посещаемости.', 'Красноярск', 'Спортивный комплекс', 'offline', '2026-05-18 10:00:00', '2026-05-18 18:00:00', 40, 'closed', '10:00 — жеребьевка; 11:00 — игры; 17:00 — финал.', NULL),
(6, 1, 1, 'Онлайн-лекция по UX-дизайну', 'Разбор пользовательских сценариев и макетов.', 'Лекция посвящена анализу интерфейсов, построению пользовательских путей и подготовке макетов для учебных проектов.', 'Москва', 'Zoom', 'online', '2026-05-22 18:00:00', '2026-05-22 20:00:00', 150, 'published', '18:00 — лекция; 19:00 — кейсы; 19:30 — ответы на вопросы.', NULL),
(7, 1, 2, 'Подготовка к защите ВКР', 'Методический семинар по структуре диплома.', 'Семинар для выпускников по оформлению диплома, презентации и демонстрации программного продукта.', 'Красноярск', 'Аудитория 214', 'offline', '2026-06-02 15:00:00', '2026-06-02 17:00:00', 35, 'draft', '15:00 — структура работы; 16:00 — демонстрация продукта; 16:30 — рекомендации.', NULL),
(8, 1, 5, 'Нетворкинг-встреча выпускников', 'Встреча студентов и выпускников прошлых лет.', 'Неформальное мероприятие для обмена опытом, обсуждения трудоустройства и развития карьерного трека.', 'Красноярск', 'Коворкинг университета', 'hybrid', '2026-06-10 17:00:00', '2026-06-10 20:00:00', 70, 'cancelled', '17:00 — приветствие; 17:30 — истории выпускников; 18:30 — networking.', NULL)
ON DUPLICATE KEY UPDATE
title = VALUES(title),
short_description = VALUES(short_description),
description = VALUES(description),
city = VALUES(city),
location = VALUES(location),
format = VALUES(format),
starts_at = VALUES(starts_at),
ends_at = VALUES(ends_at),
capacity = VALUES(capacity),
status = VALUES(status),
program = VALUES(program);

INSERT INTO registrations (registration_id, event_id, student_id, status, registered_at, cancelled_at) VALUES
(1, 1, 1, 'registered', '2026-03-20 10:00:00', NULL),
(2, 1, 2, 'registered', '2026-03-21 12:15:00', NULL),
(3, 2, 1, 'registered', '2026-03-22 09:30:00', NULL),
(4, 3, 3, 'registered', '2026-03-23 14:45:00', NULL),
(5, 5, 2, 'registered', '2026-03-24 16:20:00', NULL),
(6, 8, 1, 'cancelled', '2026-03-25 11:00:00', '2026-03-28 11:00:00')
ON DUPLICATE KEY UPDATE
status = VALUES(status),
registered_at = VALUES(registered_at),
cancelled_at = VALUES(cancelled_at);

INSERT INTO attendance (attendance_id, registration_id, check_in_at, method) VALUES
(1, 1, '2026-04-12 10:52:00', 'qr'),
(2, 5, '2026-05-18 09:48:00', 'manual')
ON DUPLICATE KEY UPDATE
check_in_at = VALUES(check_in_at),
method = VALUES(method);
