<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$data = readJsonInput();
requireFields($data, ['full_name', 'email', 'password']);

$fullName = trim((string) $data['full_name']);
$email = validateEmailValue((string) $data['email']);
$password = validatePasswordValue((string) $data['password']);
$groupName = trim((string) ($data['group_name'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));

try {
    $pdo = getDb();

    $checkStmt = $pdo->prepare('SELECT id FROM students WHERE email = :email LIMIT 1');
    $checkStmt->execute(['email' => $email]);

    if ($checkStmt->fetch()) {
        jsonResponse([
            'success' => false,
            'message' => 'A user with this email already exists.',
        ], 409);
    }

    $stmt = $pdo->prepare('
        INSERT INTO students (full_name, email, password_hash, group_name, phone)
        VALUES (:full_name, :email, :password_hash, :group_name, :phone)
    ');
    $stmt->execute([
        'full_name' => $fullName,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'group_name' => $groupName !== '' ? $groupName : null,
        'phone' => $phone !== '' ? $phone : null,
    ]);

    $user = [
        'id' => (int) $pdo->lastInsertId(),
        'full_name' => $fullName,
        'email' => $email,
        'role' => 'student',
    ];

    setCurrentUser($user);

    jsonResponse([
        'success' => true,
        'message' => 'Registration completed successfully.',
        'data' => $user,
    ], 201);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to register user.',
        'error' => $exception->getMessage(),
    ], 500);
}
