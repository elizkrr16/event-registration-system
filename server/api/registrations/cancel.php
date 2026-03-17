<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$user = requireAuth();

if ($user['role'] !== 'student') {
    jsonResponse([
        'success' => false,
        'message' => 'Only students can cancel registrations.',
    ], 403);
}

$data = readJsonInput();
requireFields($data, ['event_id']);
$eventId = validatePositiveInt($data['event_id'], 'event_id');

try {
    $pdo = getDb();

    $stmt = $pdo->prepare('
        UPDATE registrations
        SET status = "cancelled"
        WHERE event_id = :event_id AND student_id = :student_id AND status = "registered"
    ');
    $stmt->execute([
        'event_id' => $eventId,
        'student_id' => $user['id'],
    ]);

    if ($stmt->rowCount() === 0) {
        jsonResponse([
            'success' => false,
            'message' => 'Active registration not found.',
        ], 404);
    }

    jsonResponse([
        'success' => true,
        'message' => 'Registration cancelled successfully.',
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to cancel registration.',
        'error' => $exception->getMessage(),
    ], 500);
}
