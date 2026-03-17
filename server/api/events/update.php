<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();
$data = readJsonInput();
requireFields($data, [
    'event_id',
    'title',
    'short_description',
    'description',
    'city',
    'location',
    'format',
    'starts_at',
    'ends_at',
    'capacity',
    'category_id',
    'status',
    'program',
]);

$eventId = validatePositiveInt($data['event_id'], 'event_id');
$title = trim((string) $data['title']);
$shortDescription = trim((string) $data['short_description']);
$description = trim((string) $data['description']);
$city = trim((string) $data['city']);
$location = trim((string) $data['location']);
$format = validateEventFormat((string) $data['format']);
$startsAt = validateDateTimeValue((string) $data['starts_at'], 'starts_at');
$endsAt = validateDateTimeValue((string) $data['ends_at'], 'ends_at');
$capacity = validatePositiveInt($data['capacity'], 'capacity');
$categoryId = validatePositiveInt($data['category_id'], 'category_id');
$status = validateEventStatus((string) $data['status']);
$program = trim((string) $data['program']);
$imageUrl = trim((string) ($data['image_url'] ?? ''));

if (strtotime($endsAt) <= strtotime($startsAt)) {
    jsonResponse([
        'success' => false,
        'message' => 'Дата окончания должна быть позже даты начала.',
    ], 422);
}

try {
    $pdo = getDb();
    $stmt = $pdo->prepare('
        UPDATE events
        SET
            category_id = :category_id,
            title = :title,
            short_description = :short_description,
            description = :description,
            city = :city,
            location = :location,
            format = :format,
            starts_at = :starts_at,
            ends_at = :ends_at,
            capacity = :capacity,
            status = :status,
            program = :program,
            image_url = :image_url
        WHERE event_id = :event_id
    ');
    $stmt->execute([
        'event_id' => $eventId,
        'category_id' => $categoryId,
        'title' => $title,
        'short_description' => $shortDescription,
        'description' => $description,
        'city' => $city,
        'location' => $location,
        'format' => $format,
        'starts_at' => $startsAt,
        'ends_at' => $endsAt,
        'capacity' => $capacity,
        'status' => $status,
        'program' => $program,
        'image_url' => $imageUrl !== '' ? $imageUrl : null,
    ]);

    jsonResponse([
        'success' => true,
        'message' => 'Мероприятие обновлено.',
        'data' => null,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось обновить мероприятие.',
        'error' => $exception->getMessage(),
    ], 500);
}
