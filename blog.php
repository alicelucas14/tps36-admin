<?php 
require_once 'includes/header.php'; 

if (!isset($_GET['slug'])) {
    die("Blog not found.");
}

$stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ?");
$stmt->execute([$_GET['slug']]);
$blog = $stmt->fetch();

if (!$blog) {
    die("Blog not found.");
}

$catQuery = $pdo->query("SELECT DISTINCT category FROM blogs WHERE category IS NOT NULL")->fetchAll();
$dbCats = array_map(function($r) { return $r['category']; }, $catQuery);
$requestedCats = ['General', 'Slots Games', 'Rummy Games', 'Sports', 'Live Casino'];
$categories = array_unique(array_merge($dbCats, $requestedCats));
$currentCategory = $blog['category'] ?? 'General';
?>

<div class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div class="lg:col-span-3">
            <a href="blogs.php" class="text-secondary hover:underline mb-8 inline-block"><i class="fa-solid fa-arrow-left mr-2"></i>Back to Blogs</a>
            
            <article class="bg-accent rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                <?php if($blog['image_url']): ?>
                    <img src="<?= htmlspecialchars($blog['image_url']) ?>" alt="<?= htmlspecialchars($blog['title']) ?> Cover" class="w-full h-64 md:h-96 object-cover" onerror="this.onerror=null; this.src='https://via.placeholder.com/1200x600/070b14/fbbf24?text=Image+Not+Found';">
                <?php endif; ?>
                
                <div class="p-8 md:p-12">
                    <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"><?= htmlspecialchars($blog['title']) ?></h1>
                    <div class="flex items-center text-sm text-gray-500 mb-8 border-b border-white/10 pb-8 gap-4">
                        <span class="bg-secondary/20 text-secondary border border-secondary/30 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider"><i class="fa-solid fa-tag mr-2"></i><?= htmlspecialchars($blog['category'] ?? 'General') ?></span>
                        <span><i class="fa-regular fa-calendar mr-2"></i><?= date('F j, Y', strtotime($blog['created_at'])) ?></span>
                    </div>
                    
                    <div class="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap"><?= htmlspecialchars($blog['content']) ?></div>
                </div>
            </article>
        </div>
        
        <div class="lg:col-span-1 hidden lg:block">
            <div class="bg-accent rounded-xl border border-white/10 p-6 sticky top-24">
                <h3 class="text-xl font-bold mb-6 text-white border-b border-white/5 pb-2">Categories</h3>
                <ul class="space-y-2">
                    <li>
                        <a href="blogs.php?category=All" class="block px-4 py-2 rounded-lg transition <?= $currentCategory === 'All' ? 'bg-secondary text-primary font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white' ?>">
                            All
                        </a>
                    </li>
                    <?php foreach($categories as $cat): ?>
                    <li>
                        <a href="blogs.php?category=<?= urlencode($cat) ?>" class="block px-4 py-2 rounded-lg transition <?= $currentCategory === $cat ? 'bg-secondary text-primary font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-white' ?>">
                            <?= htmlspecialchars($cat) ?>
                        </a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
