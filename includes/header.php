<?php
// includes/header.php for public site
require_once __DIR__ . '/db.php';
$site_name = getSetting($pdo, 'site_name');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($site_name) ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#070b14', secondary: '#fbbf24', accent: '#0d1522' }
                }
            }
        }
    </script>
</head>
<body class="bg-primary text-white font-sans flex flex-col min-h-screen">
    <nav class="fixed w-full top-0 z-50 bg-accent/90 backdrop-blur-md border-b border-white/5">
        <div class="max-w-7xl mx-auto px-4">
            <div class="flex items-center justify-between h-20">
                <a href="/index.php" class="flex items-center gap-3">
                    <i class="fa-solid fa-shield text-secondary text-2xl"></i>
                    <span class="text-2xl font-bold tracking-wide">UU7<span class="text-secondary">Game</span></span>
                </a>
                <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <a href="index.php" class="hover:text-secondary transition-colors">Home</a>
                    <a href="blogs.php" class="hover:text-secondary transition-colors">Blogs</a>
                    <a href="reviews.php" class="hover:text-secondary transition-colors">Reviews</a>
                    <a href="faq.php" class="hover:text-secondary transition-colors">FAQ</a>
                    <a href="contact.php" class="hover:text-secondary transition-colors">Contact</a>
                    <a href="#" class="bg-secondary text-primary px-6 py-2 md:py-2.5 rounded-full font-bold hover:bg-yellow-400 transition transform hover:-translate-y-0.5 ml-2 shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]">Download App</a>
                </div>
                <a href="/admin/index.php" class="text-secondary border border-secondary px-4 py-2 rounded-full hover:bg-secondary hover:text-black transition">Admin Login</a>
            </div>
        </div>
    </nav>
    <main class="flex-1 pt-20">
