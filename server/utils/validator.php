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
            'message' => 'Заполните обязательные поля.',
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
            'message' => 'Некорректный email.',
        ], 422);
    }

    return $email;
}

function validatePasswordValue(string $password): string
{
    if (mb_strlen($password) < 6) {
        jsonResponse([
            'success' => false,
            'message' => 'Пароль должен содержать не менее 6 символов.',
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
            'message' => "Поле {$fieldName} должно быть положительным числом.",
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
            'message' => 'Некорректный статус мероприятия.',
        ], 422);
    }

    return $status;
}

function validateEventFormat(string $format): string
{
    $allowed = ['online', 'offline', 'hybrid'];

    if (!in_array($format, $allowed, true)) {
        jsonResponse([
            'success' => false,
            'message' => 'Некорректный формат мероприятия.',
        ], 422);
    }

    return $format;
}

function validateDateTimeValue(string $value, string $fieldName): string
{
    $date = date_create($value);

    if (!$date) {
        jsonResponse([
            'success' => false,
            'message' => "Поле {$fieldName} должно содержать корректную дату и время.",
        ], 422);
    }

    return $date->format('Y-m-d H:i:s');
}
