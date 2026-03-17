<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$user = requireAuth();

if ($user['role'] !== 'student') {
    jsonResponse([
        'success' => false,
        'message' => 'Раздел доступен только участнику.',
    ], 403);
}

try {
    $pdo = getDb();
    $stmt = $pdo->prepare('
        SELECT
            r.registration_id,
            r.status AS registration_status,
            r.registered_at,
            r.cancelled_at,
            e.event_id,
            e.title,
            e.short_description,
            e.city,
            e.location,
            e.format,
            e.starts_at,
            e.ends_at,
            e.status AS event_status,
            c.name AS category_name
        FROM registrations r
        INNER JOIN events e ON e.event_id = r.event_id
        INNER JOIN categories c ON c.category_id = e.category_id
        WHERE r.student_id = :student_id
        ORDER BY e.starts_at ASC
    ');
    $stmt->execute(['student_id' => $user['id']]);
    $rows = $stmt->fetchAll();

    $result = array_map(static function (array $row): array {
        return [
            'registration_id' => (int) $row['registration_id'],
            'registration_status' => $row['registration_status'],
            'registered_at' => $row['registered_at'],
            'cancelled_at' => $row['cancelled_at'],
            'event_id' => (int) $row['event_id'],
            'title' => $row['title'],
            'short_description' => $row['short_description'],
            'city' => $row['city'],
            'location' => $row['location'],
            'format' => $row['format'],
            'starts_at' => $row['starts_at'],
            'ends_at' => $row['ends_at'],
            'event_status' => $row['event_status'],
            'category_name' => $row['category_name'],
        ];
    }, $rows);

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить список ваших мероприятий.',
        'error' => $exception->getMessage(),
    ], 500);
}
