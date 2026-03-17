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
            e.id,
            e.title,
            e.short_description,
            e.description,
            e.location,
            e.event_date,
            e.capacity,
            e.status,
            e.created_at,
            c.id AS category_id,
            c.name AS category_name,
            o.id AS organizer_id,
            o.full_name AS organizer_name,
            COUNT(r.id) AS registrations_count
        FROM events e
        INNER JOIN categories c ON c.id = e.category_id
        INNER JOIN organizers o ON o.id = e.organizer_id
        LEFT JOIN registrations r ON r.event_id = e.id AND r.status = "registered"
        WHERE e.id = :id
        GROUP BY e.id, c.id, c.name, o.id, o.full_name
        LIMIT 1
    ');
    $stmt->execute(['id' => $eventId]);
    $event = $stmt->fetch();

    if (!$event) {
        jsonResponse([
            'success' => false,
            'message' => 'Event not found.',
        ], 404);
    }

    if (($event['status'] !== 'published') && (($user['role'] ?? '') !== 'admin')) {
        jsonResponse([
            'success' => false,
            'message' => 'Event not found.',
        ], 404);
    }

    $event['id'] = (int) $event['id'];
    $event['category_id'] = (int) $event['category_id'];
    $event['organizer_id'] = (int) $event['organizer_id'];
    $event['capacity'] = (int) $event['capacity'];
    $event['registrations_count'] = (int) $event['registrations_count'];

    if (($user['role'] ?? '') === 'student') {
        $registrationStmt = $pdo->prepare('
            SELECT id, status
            FROM registrations
            WHERE event_id = :event_id AND student_id = :student_id
            LIMIT 1
        ');
        $registrationStmt->execute([
            'event_id' => $eventId,
            'student_id' => $user['id'],
        ]);
        $registration = $registrationStmt->fetch();
        $event['current_user_registration'] = $registration ?: null;
    }

    jsonResponse([
        'success' => true,
        'data' => $event,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to load event details.',
        'error' => $exception->getMessage(),
    ], 500);
}
