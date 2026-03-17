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

    $studentStmt = $pdo->prepare('SELECT id, full_name, email, password_hash FROM students WHERE email = :email LIMIT 1');
    $studentStmt->execute(['email' => $email]);
    $student = $studentStmt->fetch();

    if ($student && password_verify($password, $student['password_hash'])) {
        $user = [
            'id' => (int) $student['id'],
            'full_name' => $student['full_name'],
            'email' => $student['email'],
            'role' => 'student',
        ];

        setCurrentUser($user);

        jsonResponse([
            'success' => true,
            'message' => 'Login successful.',
            'data' => $user,
        ]);
    }

    $organizerStmt = $pdo->prepare('SELECT id, full_name, email, password_hash FROM organizers WHERE email = :email LIMIT 1');
    $organizerStmt->execute(['email' => $email]);
    $organizer = $organizerStmt->fetch();

    if ($organizer && password_verify($password, $organizer['password_hash'])) {
        $user = [
            'id' => (int) $organizer['id'],
            'full_name' => $organizer['full_name'],
            'email' => $organizer['email'],
            'role' => 'admin',
        ];

        setCurrentUser($user);

        jsonResponse([
            'success' => true,
            'message' => 'Login successful.',
            'data' => $user,
        ]);
    }

    jsonResponse([
        'success' => false,
        'message' => 'Invalid email or password.',
    ], 401);
} catch (PDOException $exception) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to authenticate user.',
        'error' => $exception->getMessage(),
    ], 500);
}
