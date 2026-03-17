<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

try {
    $pdo = getDb();
    $stmt = $pdo->query('SELECT id, name, description FROM categories ORDER BY name ASC');
    $categories = $stmt->fetchAll();

    $result = array_map(static function (array $row): array {
        $row['id'] = (int) $row['id'];
        return $row;
    }, $categories);

    jsonResponse([
        'success' => true,
        'data' => $result,
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to load categories.',
        'error' => $exception->getMessage(),
    ], 500);
}
