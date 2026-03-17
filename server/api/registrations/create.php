<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$user = requireAuth();

if ($user['role'] !== 'student') {
    jsonResponse([
        'success' => false,
        'message' => 'Записаться на мероприятие может только участник.',
    ], 403);
}

$data = readJsonInput();
requireFields($data, ['event_id']);
$eventId = validatePositiveInt($data['event_id'], 'event_id');

try {
    $pdo = getDb();

    $eventStmt = $pdo->prepare('
        SELECT
            e.event_id,
            e.capacity,
            e.status,
            COUNT(r.registration_id) AS registrations_count
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = "registered"
        WHERE e.event_id = :event_id
        GROUP BY e.event_id, e.capacity, e.status
        LIMIT 1
    ');
    $eventStmt->execute(['event_id' => $eventId]);
    $event = $eventStmt->fetch();

    if (!$event) {
        jsonResponse([
            'success' => false,
            'message' => 'Мероприятие не найдено.',
        ], 404);
    }

    if ($event['status'] !== 'published') {
        jsonResponse([
            'success' => false,
            'message' => 'Запись на это мероприятие недоступна.',
        ], 409);
    }

    $existingStmt = $pdo->prepare('
        SELECT registration_id, status
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
            'message' => 'Вы уже зарегистрированы на это мероприятие.',
        ], 409);
    }

    if ((int) $event['registrations_count'] >= (int) $event['capacity']) {
        jsonResponse([
            'success' => false,
            'message' => 'Свободных мест больше нет.',
        ], 409);
    }

    if ($existing) {
        $updateStmt = $pdo->prepare('
            UPDATE registrations
            SET status = "registered", registered_at = NOW(), cancelled_at = NULL
            WHERE registration_id = :registration_id
        ');
        $updateStmt->execute(['registration_id' => $existing['registration_id']]);
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
        'message' => 'Вы успешно записались на мероприятие.',
        'data' => null,
    ], 201);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось выполнить регистрацию.',
        'error' => $exception->getMessage(),
    ], 500);
}
