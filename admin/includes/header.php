<?php
require_once __DIR__ . '/../../includes/db.php';
// Basic session check could go here if we implemented login. Skipping for now for easy local preview.
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - UU7Game CMS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { primary: '#0d1522', secondary: '#fbbf24', bg_light: '#f4f7fe' }
                }
            }
        }
    </script>
</head>
<body class="bg-bg_light text-gray-800 font-sans flex h-screen overflow-hidden">

<!-- SIDEBAR -->
<aside class="w-64 bg-primary text-white flex flex-col hidden md:flex">
    <div class="h-20 flex items-center justify-center border-b border-white/10">
        <h1 class="text-2xl font-bold text-white"><i class="fa-solid fa-shield text-secondary mr-2"></i> UU7Game</h1>
    </div>
    
    <nav class="flex-1 py-6 px-4 space-y-2">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 ml-2">Menu</p>
        
        <a href="/admin/index.php" class="flex items-center space-x-3 px-4 py-3 bg-blue-600 rounded-lg text-white font-medium transition">
            <i class="fa-solid fa-gauge w-5"></i> <span>Dashboard</span>
        </a>
        <a href="/admin/blogs.php" class="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg font-medium transition">
            <i class="fa-solid fa-pen-nib w-5"></i> <span>Blogs</span>
        </a>
        <a href="/admin/reviews.php" class="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg font-medium transition">
            <i class="fa-solid fa-star w-5"></i> <span>Reviews</span>
        </a>
        <a href="/admin/faq.php" class="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg font-medium transition">
            <i class="fa-solid fa-circle-question w-5"></i> <span>FAQ</span>
        </a>
        
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 ml-2 block">Configuration</p>
        
        <a href="/admin/settings.php" class="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg font-medium transition">
            <i class="fa-solid fa-gear w-5"></i> <span>Site Settings</span>
        </a>
    </nav>
</aside>

<!-- MAIN CONTENT WRAPPER -->
<div class="flex-1 flex flex-col h-screen overflow-hidden">
    
    <!-- TOPBAR -->
    <header class="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 w-full relative">
        <h2 class="text-xl font-bold text-gray-800">Admin Panel</h2>
        <div class="flex items-center gap-4">
            <a href="/" target="_blank" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition">View Site</a>
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                A
            </div>
        </div>
    </header>
    
    <!-- PAGE CONTENT -->
    <main class="flex-1 overflow-y-auto p-8 relative break-words w-full h-full">
