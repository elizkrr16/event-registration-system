<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();
$data = readJsonInput();
requireFields($data, ['id', 'title', 'short_description', 'description', 'location', 'event_date', 'capacity', 'category_id', 'status']);

$eventId = validatePositiveInt($data['id'], 'id');
$title = trim((string) $data['title']);
$shortDescription = trim((string) $data['short_description']);
$description = trim((string) $data['description']);
$location = trim((string) $data['location']);
$eventDate = validateDateTimeValue((string) $data['event_date'], 'event_date');
$capacity = validatePositiveInt($data['capacity'], 'capacity');
$categoryId = validatePositiveInt($data['category_id'], 'category_id');
$status = validateEventStatus((string) $data['status']);

try {
    $pdo = getDb();

    $stmt = $pdo->prepare('
        UPDATE events
        SET
            title = :title,
            short_description = :short_description,
            description = :description,
            location = :location,
            event_date = :event_date,
            capacity = :capacity,
            category_id = :category_id,
            status = :status
        WHERE id = :id
    ');
    $stmt->execute([
        'id' => $eventId,
        'title' => $title,
        'short_description' => $shortDescription,
        'description' => $description,
        'location' => $location,
        'event_date' => $eventDate,
        'capacity' => $capacity,
        'category_id' => $categoryId,
        'status' => $status,
    ]);

    if ($stmt->rowCount() === 0) {
        $checkStmt = $pdo->prepare('SELECT id FROM events WHERE id = :id LIMIT 1');
        $checkStmt->execute(['id' => $eventId]);

        if (!$checkStmt->fetch()) {
            jsonResponse([
                'success' => false,
                'message' => 'Event not found.',
            ], 404);
        }
    }

    jsonResponse([
        'success' => true,
        'message' => 'Event updated successfully.',
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to update event.',
        'error' => $exception->getMessage(),
    ], 500);
}
