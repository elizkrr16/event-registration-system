<?php

function getCurrentUser(): ?array
{
    if (!isset($_SESSION['user'])) {
        return null;
    }

    return $_SESSION['user'];
}

function setCurrentUser(array $user): void
{
    $_SESSION['user'] = $user;
}

function clearCurrentUser(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
}

function requireAuth(): array
{
    $user = getCurrentUser();

    if (!$user) {
        jsonResponse([
            'success' => false,
            'message' => 'Authentication required.',
        ], 401);
    }

    return $user;
}

function requireAdmin(): array
{
    $user = requireAuth();

    if (($user['role'] ?? '') !== 'admin') {
        jsonResponse([
            'success' => false,
            'message' => 'Admin access required.',
        ], 403);
    }

    return $user;
}
