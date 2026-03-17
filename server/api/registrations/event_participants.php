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
            r.id,
            r.status,
            r.registered_at,
            s.id AS student_id,
            s.full_name,
            s.email,
            s.group_name,
            s.phone,
            a.is_present
        FROM registrations r
        INNER JOIN students s ON s.id = r.student_id
        LEFT JOIN attendance a ON a.registration_id = r.id
        WHERE r.event_id = :event_id
        ORDER BY r.registered_at DESC
    ');
    $stmt->execute(['event_id' => $eventId]);
    $participants = $stmt->fetchAll();

    $result = array_map(static function (array $row): array {
        $row['id'] = (int) $row['id'];
        $row['student_id'] = (int) $row['student_id'];
        $row['is_present'] = $row['is_present'] !== null ? (bool) $row['is_present'] : null;
        return $row;
    }, $participants);

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to load event participants.',
        'error' => $exception->getMessage(),
    ], 500);
}
