<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();
$data = readJsonInput();
requireFields($data, ['event_id']);

$eventId = validatePositiveInt($data['event_id'], 'event_id');

try {
    $pdo = getDb();
    $stmt = $pdo->prepare('UPDATE events SET status = "cancelled" WHERE event_id = :event_id');
    $stmt->execute(['event_id' => $eventId]);

    if ($stmt->rowCount() === 0) {
        jsonResponse([
            'success' => false,
            'message' => 'Мероприятие не найдено.',
        ], 404);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Мероприятие скрыто.',
        'data' => null,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось изменить статус мероприятия.',
        'error' => $exception->getMessage(),
    ], 500);
}
