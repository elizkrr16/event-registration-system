<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$admin = requireAdmin();
$data = readJsonInput();
requireFields($data, ['title', 'short_description', 'description', 'location', 'event_date', 'capacity', 'category_id', 'status']);

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
        INSERT INTO events (title, short_description, description, location, event_date, capacity, status, category_id, organizer_id)
        VALUES (:title, :short_description, :description, :location, :event_date, :capacity, :status, :category_id, :organizer_id)
    ');
    $stmt->execute([
        'title' => $title,
        'short_description' => $shortDescription,
        'description' => $description,
        'location' => $location,
        'event_date' => $eventDate,
        'capacity' => $capacity,
        'status' => $status,
        'category_id' => $categoryId,
        'organizer_id' => $admin['id'],
    ]);

    jsonResponse([
        'success' => true,
        'message' => 'Event created successfully.',
        'data' => ['id' => (int) $pdo->lastInsertId()],
    ], 201);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to create event.',
        'error' => $exception->getMessage(),
    ], 500);
}
