<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();
$data = readJsonInput();
requireFields($data, ['id']);

$eventId = validatePositiveInt($data['id'], 'id');

try {
    $pdo = getDb();

    $stmt = $pdo->prepare('UPDATE events SET status = "cancelled" WHERE id = :id');
    $stmt->execute(['id' => $eventId]);

    if ($stmt->rowCount() === 0) {
        jsonResponse([
            'success' => false,
            'message' => 'Event not found.',
        ], 404);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Event archived successfully.',
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to archive event.',
        'error' => $exception->getMessage(),
    ], 500);
}
