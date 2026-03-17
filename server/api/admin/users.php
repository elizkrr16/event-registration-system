<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

requireAdmin();

try {
    $pdo = getDb();
    $stmt = $pdo->query('
        SELECT
            s.student_id,
            s.full_name,
            s.email,
            s.phone,
            COUNT(r.registration_id) AS registrations_count
        FROM students s
        LEFT JOIN registrations r ON r.student_id = s.student_id AND r.status = "registered"
        GROUP BY s.student_id, s.full_name, s.email, s.phone
        ORDER BY s.created_at DESC
    ');

    jsonResponse([
        'success' => true,
        'data' => $stmt->fetchAll(),
    ]);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось загрузить список пользователей.',
        'error' => $exception->getMessage(),
    ], 500);
}
