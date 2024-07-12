<?php

/**
 * Load environment variables from a .env file into $_ENV and $_SERVER
 *
 * @param string $path
 * @return void
 */
function loadEnv($path)
{
    if (!file_exists($path)) {
        throw new InvalidArgumentException(sprintf('%s file does not exist', $path));
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
        }

        if (!array_key_exists($name, $_SERVER)) {
            $_SERVER[$name] = $value;
        }

        putenv(sprintf('%s=%s', $name, $value));
    }
}

// Usage example
loadEnv(__DIR__ . '/.env');
?>
