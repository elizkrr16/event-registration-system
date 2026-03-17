<?php

function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonInput(): array
{
    $input = file_get_contents('php://input');

    if ($input === false || $input === '') {
        return [];
    }

    $decoded = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid JSON payload.',
        ], 400);
    }

    return $decoded;
}
