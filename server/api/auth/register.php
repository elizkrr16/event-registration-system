<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$data = readJsonInput();
requireFields($data, ['full_name', 'email', 'phone', 'password']);

$fullName = trim((string) $data['full_name']);
$email = validateEmailValue((string) $data['email']);
$phone = trim((string) $data['phone']);
$password = validatePasswordValue((string) $data['password']);

try {
    $pdo = getDb();

    $checkStmt = $pdo->prepare('SELECT student_id FROM students WHERE email = :email LIMIT 1');
    $checkStmt->execute(['email' => $email]);

    if ($checkStmt->fetch()) {
        jsonResponse([
            'success' => false,
            'message' => 'Пользователь с таким email уже зарегистрирован.',
        ], 409);
    }

    $stmt = $pdo->prepare('
        INSERT INTO students (full_name, email, phone, password_hash)
        VALUES (:full_name, :email, :phone, :password_hash)
    ');
    $stmt->execute([
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    $user = [
        'id' => (int) $pdo->lastInsertId(),
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'role' => 'student',
    ];

    setCurrentUser($user);

    jsonResponse([
        'success' => true,
        'message' => 'Регистрация прошла успешно.',
        'data' => $user,
    ], 201);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось зарегистрировать пользователя.',
        'error' => $exception->getMessage(),
    ], 500);
}
