<?php

require_once __DIR__ . '/../../config/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

clearCurrentUser();

jsonResponse([
    'success' => true,
    'message' => 'Logout successful.',
]);
