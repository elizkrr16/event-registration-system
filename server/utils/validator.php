<?php

function requireFields(array $data, array $fields): void
{
    $missing = [];

    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
            $missing[] = $field;
        }
    }

    if ($missing !== []) {
        jsonResponse([
            'success' => false,
            'message' => 'Missing required fields.',
            'errors' => $missing,
        ], 422);
    }
}

function validateEmailValue(string $email): string
{
    $email = trim($email);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid email address.',
        ], 422);
    }

    return $email;
}

function validatePasswordValue(string $password): string
{
    if (mb_strlen($password) < 6) {
        jsonResponse([
            'success' => false,
            'message' => 'Password must contain at least 6 characters.',
        ], 422);
    }

    return $password;
}

function validatePositiveInt(mixed $value, string $fieldName): int
{
    $validated = filter_var($value, FILTER_VALIDATE_INT, [
        'options' => ['min_range' => 1],
    ]);

    if ($validated === false) {
        jsonResponse([
            'success' => false,
            'message' => "Field {$fieldName} must be a positive integer.",
        ], 422);
    }

    return (int) $validated;
}

function validateEventStatus(string $status): string
{
    $allowed = ['draft', 'published', 'closed', 'cancelled'];

    if (!in_array($status, $allowed, true)) {
        jsonResponse([
            'success' => false,
            'message' => 'Invalid event status.',
        ], 422);
    }

    return $status;
}

function validateDateTimeValue(string $value, string $fieldName): string
{
    $date = date_create($value);

    if (!$date) {
        jsonResponse([
            'success' => false,
            'message' => "Field {$fieldName} must be a valid date/time.",
        ], 422);
    }

    return $date->format('Y-m-d H:i:s');
}
