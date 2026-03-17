<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$user = requireAuth();

if ($user['role'] !== 'student') {
    jsonResponse([
        'success' => false,
        'message' => 'Only students can register for events.',
    ], 403);
}

$data = readJsonInput();
requireFields($data, ['event_id']);
$eventId = validatePositiveInt($data['event_id'], 'event_id');

try {
    $pdo = getDb();

    $eventStmt = $pdo->prepare('
        SELECT
            e.id,
            e.capacity,
            e.status,
            COUNT(r.id) AS registrations_count
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.id AND r.status = "registered"
        WHERE e.id = :event_id
        GROUP BY e.id, e.capacity, e.status
        LIMIT 1
    ');
    $eventStmt->execute(['event_id' => $eventId]);
    $event = $eventStmt->fetch();

    if (!$event || $event['status'] !== 'published') {
        jsonResponse([
            'success' => false,
            'message' => 'Event is not available for registration.',
        ], 404);
    }

    $existingStmt = $pdo->prepare('
        SELECT id, status
        FROM registrations
        WHERE event_id = :event_id AND student_id = :student_id
        LIMIT 1
    ');
    $existingStmt->execute([
        'event_id' => $eventId,
        'student_id' => $user['id'],
    ]);
    $existing = $existingStmt->fetch();

    if ($existing && $existing['status'] === 'registered') {
        jsonResponse([
            'success' => false,
            'message' => 'You are already registered for this event.',
        ], 409);
    }

    if ((int) $event['registrations_count'] >= (int) $event['capacity']) {
        jsonResponse([
            'success' => false,
            'message' => 'Registration is closed because the event is full.',
        ], 409);
    }

    if ($existing) {
        $updateStmt = $pdo->prepare('
            UPDATE registrations
            SET status = "registered", registered_at = NOW()
            WHERE id = :id
        ');
        $updateStmt->execute(['id' => $existing['id']]);
    } else {
        $insertStmt = $pdo->prepare('
            INSERT INTO registrations (event_id, student_id, status)
            VALUES (:event_id, :student_id, "registered")
        ');
        $insertStmt->execute([
            'event_id' => $eventId,
            'student_id' => $user['id'],
        ]);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Registration completed successfully.',
    ], 201);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to create registration.',
        'error' => $exception->getMessage(),
    ], 500);
}
