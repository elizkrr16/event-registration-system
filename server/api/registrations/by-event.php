<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();
$eventId = validatePositiveInt($_GET['event_id'] ?? null, 'event_id');

try {
    $pdo = getDb();
    $stmt = $pdo->prepare('
        SELECT
            r.registration_id,
            r.status,
            r.registered_at,
            r.cancelled_at,
            s.student_id,
            s.full_name,
            s.email,
            s.phone,
            a.check_in_at,
            a.method
        FROM registrations r
        INNER JOIN students s ON s.student_id = r.student_id
        LEFT JOIN attendance a ON a.registration_id = r.registration_id
        WHERE r.event_id = :event_id
        ORDER BY r.registered_at DESC
    ');
    $stmt->execute(['event_id' => $eventId]);
    $rows = $stmt->fetchAll();

    $result = array_map(static function (array $row): array {
        return [
            'registration_id' => (int) $row['registration_id'],
            'status' => $row['status'],
            'registered_at' => $row['registered_at'],
            'cancelled_at' => $row['cancelled_at'],
            'student_id' => (int) $row['student_id'],
            'full_name' => $row['full_name'],
            'email' => $row['email'],
            'phone' => $row['phone'],
            'check_in_at' => $row['check_in_at'],
            'method' => $row['method'],
        ];
    }, $rows);

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить список участников.',
        'error' => $exception->getMessage(),
    ], 500);
}
