<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$data = readJsonInput();
requireFields($data, ['email', 'password']);

$email = validateEmailValue((string) $data['email']);
$password = (string) $data['password'];

try {
    $pdo = getDb();

    $studentStmt = $pdo->prepare('SELECT student_id, full_name, email, phone, password_hash FROM students WHERE email = :email LIMIT 1');
    $studentStmt->execute(['email' => $email]);
    $student = $studentStmt->fetch();

    if ($student && password_verify($password, $student['password_hash'])) {
        $user = [
            'id' => (int) $student['student_id'],
            'full_name' => $student['full_name'],
            'email' => $student['email'],
            'phone' => $student['phone'],
            'role' => 'student',
        ];

        setCurrentUser($user);

        jsonResponse([
            'success' => true,
            'message' => 'Вход выполнен успешно.',
            'data' => $user,
        ]);
    }

    $organizerStmt = $pdo->prepare('SELECT organizer_id, full_name, email, phone, password_hash FROM organizers WHERE email = :email LIMIT 1');
    $organizerStmt->execute(['email' => $email]);
    $organizer = $organizerStmt->fetch();

    if ($organizer && password_verify($password, $organizer['password_hash'])) {
        $user = [
            'id' => (int) $organizer['organizer_id'],
            'full_name' => $organizer['full_name'],
            'email' => $organizer['email'],
            'phone' => $organizer['phone'],
            'role' => 'admin',
        ];

        setCurrentUser($user);

        jsonResponse([
            'success' => true,
            'message' => 'Вход выполнен успешно.',
            'data' => $user,
        ]);
    }

    jsonResponse([
        'success' => false,
        'message' => 'Неверный email или пароль.',
    ], 401);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Не удалось выполнить вход.',
        'error' => $exception->getMessage(),
    ], 500);
}
