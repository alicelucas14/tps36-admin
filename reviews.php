<?php require_once 'includes/header.php'; 
$reviews = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC")->fetchAll();
?>

<div class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-12 border-b border-white/10 pb-4 text-center">User Reviews</h1>
    
    <div class="space-y-6">
        <?php foreach($reviews as $r): ?>
        <div class="bg-accent rounded-xl p-6 border border-white/5 shadow-md">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-white"><?= htmlspecialchars($r['reviewer_name']) ?></h3>
                <div class="text-secondary text-sm">
                    <?= str_repeat('<i class="fa-solid fa-star"></i>', $r['rating']) ?>
                </div>
            </div>
            <p class="text-gray-300 italic">"<?= nl2br(htmlspecialchars($r['comment'])) ?>"</p>
            <p class="text-xs text-gray-500 mt-4"><?= date('M j, Y', strtotime($r['created_at'])) ?></p>
        </div>
        <?php endforeach; ?>
        
        <?php if(empty($reviews)): ?>
            <p class="text-gray-500 text-center py-12">No reviews yet.</p>
        <?php endif; ?>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
