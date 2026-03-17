<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$user = requireAuth();

if ($user['role'] !== 'student') {
    jsonResponse([
        'success' => false,
        'message' => 'Only students can view personal registrations.',
    ], 403);
}

try {
    $pdo = getDb();

    $stmt = $pdo->prepare('
        SELECT
            r.id,
            r.status,
            r.registered_at,
            e.id AS event_id,
            e.title,
            e.short_description,
            e.location,
            e.event_date,
            e.status AS event_status,
            c.name AS category_name
        FROM registrations r
        INNER JOIN events e ON e.id = r.event_id
        INNER JOIN categories c ON c.id = e.category_id
        WHERE r.student_id = :student_id
        ORDER BY r.registered_at DESC
    ');
    $stmt->execute(['student_id' => $user['id']]);
    $rows = $stmt->fetchAll();

    $registrations = array_map(static function (array $row): array {
        $row['id'] = (int) $row['id'];
        $row['event_id'] = (int) $row['event_id'];
        return $row;
    }, $rows);

    jsonResponse([
        'success' => true,
        'data' => $registrations,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to load registrations.',
        'error' => $exception->getMessage(),
    ], 500);
}
