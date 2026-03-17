<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$user = getCurrentUser();
$showAll = isset($_GET['all']) && $_GET['all'] === '1' && ($user['role'] ?? '') === 'admin';
$search = trim((string) ($_GET['search'] ?? ''));
$categoryId = trim((string) ($_GET['category_id'] ?? ''));
$status = trim((string) ($_GET['status'] ?? ''));

try {
    $pdo = getDb();

    $sql = '
        SELECT
            e.id,
            e.title,
            e.short_description,
            e.description,
            e.location,
            e.event_date,
            e.capacity,
            e.status,
            c.name AS category_name,
            o.full_name AS organizer_name,
            COUNT(r.id) AS registrations_count
        FROM events e
        INNER JOIN categories c ON c.id = e.category_id
        INNER JOIN organizers o ON o.id = e.organizer_id
        LEFT JOIN registrations r ON r.event_id = e.id AND r.status = "registered"
        WHERE 1=1
    ';

    $params = [];

    if (!$showAll) {
        $sql .= ' AND e.status = "published"';
    } elseif ($status !== '') {
        $sql .= ' AND e.status = :status';
        $params['status'] = validateEventStatus($status);
    }

    if ($search !== '') {
        $sql .= ' AND (e.title LIKE :search OR e.short_description LIKE :search OR e.location LIKE :search)';
        $params['search'] = '%' . $search . '%';
    }

    if ($categoryId !== '') {
        $sql .= ' AND e.category_id = :category_id';
        $params['category_id'] = validatePositiveInt($categoryId, 'category_id');
    }

    $sql .= '
        GROUP BY e.id, c.name, o.full_name
        ORDER BY e.event_date ASC
    ';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $events = $stmt->fetchAll();

    $result = array_map(static function (array $event): array {
        $event['id'] = (int) $event['id'];
        $event['capacity'] = (int) $event['capacity'];
        $event['registrations_count'] = (int) $event['registrations_count'];
        return $event;
    }, $events);

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to load events.',
        'error' => $exception->getMessage(),
    ], 500);
}
