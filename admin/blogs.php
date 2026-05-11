<?php 
require_once 'includes/header.php'; 

// Handle Create / Delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$_POST['id']]);
    } else {
        $title = $_POST['title'];
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
        $content = $_POST['content'];
        $image_url = $_POST['image_url'];
        
        $stmt = $pdo->prepare("INSERT INTO blogs (title, slug, content, image_url) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $slug, $content, $image_url]);
    }
    header("Location: blogs.php");
    exit();
}

$blogs = $pdo->query("SELECT * FROM blogs ORDER BY created_at DESC")->fetchAll();
?>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Manage Blogs</h1>
</div>

<!-- Add Form -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
    <h3 class="text-lg font-bold mb-4">Add New Blog</h3>
    <form method="POST" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-1">Title</label>
                <input type="text" name="title" required class="w-full border rounded px-3 py-2">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Image URL</label>
                <input type="url" name="image_url" class="w-full border rounded px-3 py-2">
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Content</label>
            <textarea name="content" required rows="4" class="w-full border rounded px-3 py-2"></textarea>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-medium">Save Blog</button>
    </form>
</div>

<!-- List -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-left">
        <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            <?php foreach($blogs as $blog): ?>
            <tr>
                <td class="px-6 py-4 font-medium"><?= htmlspecialchars($blog['title']) ?></td>
                <td class="px-6 py-4"><span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full"><?= $blog['status'] ?></span></td>
                <td class="px-6 py-4 text-right">
                    <form method="POST" class="inline">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= $blog['id'] ?>">
                        <button type="submit" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php require_once 'includes/footer.php'; ?>
