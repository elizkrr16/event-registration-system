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
$format = trim((string) ($_GET['format'] ?? ''));
$city = trim((string) ($_GET['city'] ?? ''));
$date = trim((string) ($_GET['date'] ?? ''));
$tab = trim((string) ($_GET['tab'] ?? 'upcoming'));
$limit = max(1, min(50, (int) ($_GET['limit'] ?? 50)));
$offset = max(0, (int) ($_GET['offset'] ?? 0));

try {
    $pdo = getDb();

    $sql = '
        SELECT
            e.event_id,
            e.title,
            e.short_description,
            e.description,
            e.city,
            e.location,
            e.format,
            e.starts_at,
            e.ends_at,
            e.capacity,
            e.status,
            e.program,
            e.image_url,
            c.category_id,
            c.name AS category_name,
            o.organizer_id,
            o.full_name AS organizer_name,
            COUNT(r.registration_id) AS registrations_count
        FROM events e
        INNER JOIN categories c ON c.category_id = e.category_id
        INNER JOIN organizers o ON o.organizer_id = e.organizer_id
        LEFT JOIN registrations r ON r.event_id = e.event_id AND r.status = "registered"
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
        $sql .= ' AND (e.title LIKE :search OR e.short_description LIKE :search OR e.description LIKE :search)';
        $params['search'] = '%' . $search . '%';
    }

    if ($categoryId !== '') {
        $sql .= ' AND e.category_id = :category_id';
        $params['category_id'] = validatePositiveInt($categoryId, 'category_id');
    }

    if ($format !== '') {
        $sql .= ' AND e.format = :format';
        $params['format'] = validateEventFormat($format);
    }

    if ($city !== '') {
        $sql .= ' AND e.city LIKE :city';
        $params['city'] = '%' . $city . '%';
    }

    if ($date !== '') {
        $sql .= ' AND DATE(e.starts_at) = :date';
        $params['date'] = $date;
    }

    if ($tab === 'upcoming') {
        $sql .= ' AND e.starts_at >= NOW()';
    }

    $sql .= '
        GROUP BY e.event_id, c.category_id, c.name, o.organizer_id, o.full_name
        ORDER BY e.starts_at ASC
        LIMIT :limit OFFSET :offset
    ';

    $stmt = $pdo->prepare($sql);

    foreach ($params as $key => $value) {
        $stmt->bindValue(':' . $key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();
    $events = $stmt->fetchAll();

    $result = array_map(static function (array $event): array {
        return [
            'event_id' => (int) $event['event_id'],
            'title' => $event['title'],
            'short_description' => $event['short_description'],
            'description' => $event['description'],
            'city' => $event['city'],
            'location' => $event['location'],
            'format' => $event['format'],
            'starts_at' => $event['starts_at'],
            'ends_at' => $event['ends_at'],
            'capacity' => (int) $event['capacity'],
            'status' => $event['status'],
            'program' => $event['program'],
            'image_url' => $event['image_url'],
            'category_id' => (int) $event['category_id'],
            'category_name' => $event['category_name'],
            'organizer_id' => (int) $event['organizer_id'],
            'organizer_name' => $event['organizer_name'],
            'registrations_count' => (int) $event['registrations_count'],
        ];
    }, $events);

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить список мероприятий.',
        'error' => $exception->getMessage(),
    ], 500);
}
