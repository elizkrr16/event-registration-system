<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();

try {
    $pdo = getDb();

    $summaryStmt = $pdo->query('
        SELECT
            (SELECT COUNT(*) FROM events) AS total_events,
            (SELECT COUNT(*) FROM events WHERE status = "published") AS published_events,
            (SELECT COUNT(*) FROM registrations WHERE status = "registered") AS active_registrations,
            (SELECT COUNT(*) FROM students) AS total_students
    ');

    $eventsStmt = $pdo->query('
        SELECT
            e.event_id,
            e.title,
            e.status,
            e.capacity,
            e.starts_at,
            COUNT(r.registration_id) AS registrations_count
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = "registered"
        GROUP BY e.event_id, e.title, e.status, e.capacity, e.starts_at
        ORDER BY e.starts_at ASC
    ');

    jsonResponse([
        'success' => true,
        'data' => [
            'summary' => $summaryStmt->fetch(),
            'events' => $eventsStmt->fetchAll(),
        ],
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить статистику.',
        'error' => $exception->getMessage(),
    ], 500);
}
