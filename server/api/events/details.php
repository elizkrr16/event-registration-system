<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$eventId = validatePositiveInt($_GET['id'] ?? null, 'id');
$user = getCurrentUser();

try {
    $pdo = getDb();

    $stmt = $pdo->prepare('
        SELECT
            e.event_id,
            e.title,
            e.short_description,
            e.description,
            e.city,
            e.location,
            e.format,
            e.starts_at,
            e.ends_at,
            e.capacity,
            e.status,
            e.program,
            e.image_url,
            e.created_at,
            c.category_id,
            c.name AS category_name,
            o.organizer_id,
            o.full_name AS organizer_name,
            COUNT(r.registration_id) AS registrations_count
        FROM events e
        INNER JOIN categories c ON c.category_id = e.category_id
        INNER JOIN organizers o ON o.organizer_id = e.organizer_id
        LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = "registered"
        WHERE e.event_id = :event_id
        GROUP BY e.event_id, c.category_id, c.name, o.organizer_id, o.full_name
        LIMIT 1
    ');
    $stmt->execute(['event_id' => $eventId]);
    $event = $stmt->fetch();

    if (!$event) {
        jsonResponse([
            'success' => false,
            'message' => 'Мероприятие не найдено.',
        ], 404);
    }

    if (($event['status'] !== 'published') && (($user['role'] ?? '') !== 'admin')) {
        jsonResponse([
            'success' => false,
            'message' => 'Мероприятие не найдено.',
        ], 404);
    }

    $result = [
        'event_id' => (int) $event['event_id'],
        'title' => $event['title'],
        'short_description' => $event['short_description'],
        'description' => $event['description'],
        'city' => $event['city'],
        'location' => $event['location'],
        'format' => $event['format'],
        'starts_at' => $event['starts_at'],
        'ends_at' => $event['ends_at'],
        'capacity' => (int) $event['capacity'],
        'status' => $event['status'],
        'program' => $event['program'],
        'image_url' => $event['image_url'],
        'created_at' => $event['created_at'],
        'category_id' => (int) $event['category_id'],
        'category_name' => $event['category_name'],
        'organizer_id' => (int) $event['organizer_id'],
        'organizer_name' => $event['organizer_name'],
        'registrations_count' => (int) $event['registrations_count'],
    ];

    if (($user['role'] ?? '') === 'student') {
        $registrationStmt = $pdo->prepare('
            SELECT registration_id, status, registered_at, cancelled_at
            FROM registrations
            WHERE event_id = :event_id AND student_id = :student_id
            LIMIT 1
        ');
        $registrationStmt->execute([
            'event_id' => $eventId,
            'student_id' => $user['id'],
        ]);
        $result['current_user_registration'] = $registrationStmt->fetch() ?: null;
    }

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить мероприятие.',
        'error' => $exception->getMessage(),
    ], 500);
}
