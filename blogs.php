<?php require_once 'includes/header.php'; 
$currentCategory = isset($_GET['category']) ? $_GET['category'] : 'All';

if ($currentCategory !== 'All') {
    $stmt = $pdo->prepare("SELECT * FROM blogs WHERE category = ? ORDER BY created_at DESC");
    $stmt->execute([$currentCategory]);
    $blogs = $stmt->fetchAll();
} else {
    $blogs = $pdo->query("SELECT * FROM blogs ORDER BY created_at DESC")->fetchAll();
}

$catQuery = $pdo->query("SELECT DISTINCT category FROM blogs WHERE category IS NOT NULL")->fetchAll();
$dbCats = array_map(function($r) { return $r['category']; }, $catQuery);
$requestedCats = ['General', 'Slots Games', 'Rummy Games', 'Sports', 'Live Casino'];
$categories = array_unique(array_merge($dbCats, $requestedCats));
?>

<div class="max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div class="lg:col-span-3">
            <div class="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h1 class="text-4xl font-bold">Latest Blogs</h1>
                <?php if($currentCategory !== 'All'): ?>
                    <span class="bg-secondary text-primary px-4 py-1 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(251,191,36,0.3)]"><?= htmlspecialchars($currentCategory) ?></span>
                <?php endif; ?>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <?php foreach($blogs as $blog): ?>
                <div class="bg-accent rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-secondary transition">
                    <?php if($blog['image_url']): ?>
                        <img src="<?= htmlspecialchars($blog['image_url']) ?>" alt="Cover" class="w-full h-48 object-cover" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x400/070b14/fbbf24?text=Invalid+Image+Link';">
                    <?php else: ?>
                        <div class="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500"><i class="fa-solid fa-image text-3xl"></i></div>
                    <?php endif; ?>
                    <div class="p-6">
                        <div class="mb-6">
                            <span class="text-xs font-bold text-secondary tracking-widest uppercase mb-2 block"><?= htmlspecialchars($blog['category'] ?? 'General') ?></span>
                            <h3 class="text-xl font-bold mb-3"><?= htmlspecialchars($blog['title']) ?></h3>
                            <p class="text-gray-400 line-clamp-3"><?= nl2br(htmlspecialchars($blog['content'])) ?></p>
                        </div>
                        <a href="blog.php?slug=<?= urlencode($blog['slug']) ?>" class="inline-block bg-secondary text-primary font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition text-center">Read More</a>
                    </div>
                </div>
                <?php endforeach; ?>
                
                <?php if(empty($blogs)): ?>
                    <p class="text-gray-500 col-span-2 text-center py-12">No blogs found in this category.</p>
                <?php endif; ?>
            </div>
        </div>

        <div class="lg:col-span-1">
            <div class="bg-accent rounded-xl border border-white/10 p-6 sticky top-8">
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
