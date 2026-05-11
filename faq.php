<?php require_once 'includes/header.php'; 
$faqs = $pdo->query("SELECT * FROM faqs ORDER BY created_at ASC")->fetchAll();
?>

<div class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-12 border-b border-white/10 pb-4 text-center">Frequently Asked Questions</h1>
    
    <div class="space-y-4">
        <?php foreach($faqs as $f): ?>
        <details class="group bg-accent rounded-xl border border-white/5 shadow-md">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg hover:text-secondary transition">
                <span><?= htmlspecialchars($f['question']) ?></span>
                <span class="transition group-open:rotate-180">
                    <i class="fa-solid fa-chevron-down"></i>
                </span>
            </summary>
            <div class="text-gray-400 p-6 pt-0 border-t border-white/5 mt-2">
                <?= nl2br(htmlspecialchars($f['answer'])) ?>
            </div>
        </details>
        <?php endforeach; ?>
        
        <?php if(empty($faqs)): ?>
            <p class="text-gray-500 text-center py-12">No FAQs added yet.</p>
        <?php endif; ?>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
