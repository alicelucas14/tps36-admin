<?php require_once 'includes/header.php'; ?>

<h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard Summary</h1>

<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <?php
    $counts = [
        'Blogs' => ['table' => 'blogs', 'icon' => 'fa-pen-nib', 'color' => 'blue'],
        'Reviews' => ['table' => 'reviews', 'icon' => 'fa-star', 'color' => 'yellow'],
        'FAQs' => ['table' => 'faqs', 'icon' => 'fa-circle-question', 'color' => 'green'],
    ];

    foreach ($counts as $title => $data) {
        $stmt = $pdo->query("SELECT COUNT(*) FROM " . $data['table']);
        $count = $stmt->fetchColumn();
        ?>
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-<?= $data['color'] ?>-50 flex items-center justify-center text-<?= $data['color'] ?>-500 text-2xl">
                <i class="fa-solid <?= $data['icon'] ?>"></i>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500"><?= $title ?></p>
                <h3 class="text-2xl font-bold text-gray-800"><?= $count ?></h3>
            </div>
        </div>
        <?php
    }
    ?>
</div>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-6 border-b border-gray-100">
        <h3 class="text-lg font-bold text-gray-800">Welcome to PHP CMS</h3>
        <p class="text-sm text-gray-500 mt-1">From here you can manage your site's dynamic content. Use the sidebar to navigate to the Blogs, Reviews, FAQ, or Site Settings.</p>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
