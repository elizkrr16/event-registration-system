<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

try {
    $pdo = getDb();
    $stmt = $pdo->query('SELECT category_id, name, description FROM categories ORDER BY name ASC');
    $categories = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'data' => array_map(static function (array $row): array {
            return [
                'category_id' => (int) $row['category_id'],
                'name' => $row['name'],
                'description' => $row['description'],
            ];
        }, $categories),
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить категории.',
        'error' => $exception->getMessage(),
    ], 500);
}
