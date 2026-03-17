<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();

try {
    $pdo = getDb();

    $eventStatsStmt = $pdo->query('
        SELECT
            e.id,
            e.title,
            e.status,
            e.capacity,
            COUNT(r.id) AS registrations_count
        FROM events e
        LEFT JOIN registrations r ON r.event_id = e.id AND r.status = "registered"
        GROUP BY e.id, e.title, e.status, e.capacity
        ORDER BY registrations_count DESC, e.event_date ASC
    ');

    $summaryStmt = $pdo->query('
        SELECT
            (SELECT COUNT(*) FROM events) AS total_events,
            (SELECT COUNT(*) FROM registrations WHERE status = "registered") AS total_registrations,
            (SELECT COUNT(*) FROM students) AS total_students
    ');

    $events = array_map(static function (array $row): array {
        $row['id'] = (int) $row['id'];
        $row['capacity'] = (int) $row['capacity'];
        $row['registrations_count'] = (int) $row['registrations_count'];
        return $row;
    }, $eventStatsStmt->fetchAll());

    $summary = $summaryStmt->fetch() ?: [];

    jsonResponse([
        'success' => true,
        'data' => [
            'summary' => [
                'total_events' => (int) ($summary['total_events'] ?? 0),
                'total_registrations' => (int) ($summary['total_registrations'] ?? 0),
                'total_students' => (int) ($summary['total_students'] ?? 0),
            ],
            'events' => $events,
        ],
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to load statistics.',
        'error' => $exception->getMessage(),
    ], 500);
}
