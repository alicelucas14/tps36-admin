<?php
// includes/db.php

$dbPath = __DIR__ . '/../database.sqlite';

try {
    $pdo = new PDO("sqlite:" . $dbPath);
    // Set error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Automatically create tables if they don't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'Published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewer_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        status TEXT DEFAULT 'Published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
    )");

    // Insert default settings if empty
    $stmt = $pdo->query("SELECT COUNT(*) FROM settings");
    if ($stmt->fetchColumn() == 0) {
        $defaultSettings = [
            ['site_name', 'UU7Game CMS'],
            ['contact_email', 'support@uu7game.com'],
            ['contact_phone', '+1234567890'],
            ['address', '123 Gaming Street, NY'],
            ['social_facebook', 'https://facebook.com/uu7game'],
            ['social_twitter', 'https://twitter.com/uu7game'],
            ['social_instagram', 'https://instagram.com/uu7game']
        ];
        
        $insertStmt = $pdo->prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
        foreach ($defaultSettings as $setting) {
            $insertStmt->execute($setting);
        }
    }

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Helper function to get settings easily
function getSetting($pdo, $key) {
    $stmt = $pdo->prepare("SELECT value FROM settings WHERE key = ?");
    $stmt->execute([$key]);
    return $stmt->fetchColumn();
}
?>
