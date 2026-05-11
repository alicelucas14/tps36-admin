<?php 
require_once 'includes/header.php'; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
        $stmt->execute([$_POST['id']]);
    } else {
        $reviewer_name = $_POST['reviewer_name'];
        $rating = $_POST['rating'];
        $comment = $_POST['comment'];
        
        $stmt = $pdo->prepare("INSERT INTO reviews (reviewer_name, rating, comment) VALUES (?, ?, ?)");
        $stmt->execute([$reviewer_name, $rating, $comment]);
    }
    header("Location: reviews.php");
    exit();
}

$reviews = $pdo->query("SELECT * FROM reviews ORDER BY created_at DESC")->fetchAll();
?>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Manage Reviews</h1>
</div>

<!-- Add Form -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
    <h3 class="text-lg font-bold mb-4">Add New Review</h3>
    <form method="POST" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-1">Reviewer Name</label>
                <input type="text" name="reviewer_name" required class="w-full border rounded px-3 py-2">
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Rating (1-5)</label>
                <select name="rating" class="w-full border rounded px-3 py-2">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Comment</label>
            <textarea name="comment" required rows="3" class="w-full border rounded px-3 py-2"></textarea>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-medium">Save Review</button>
    </form>
</div>

<!-- List -->
<div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full text-left">
        <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Reviewer</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
            <?php foreach($reviews as $rev): ?>
            <tr>
                <td class="px-6 py-4 font-medium"><?= htmlspecialchars($rev['reviewer_name']) ?></td>
                <td class="px-6 py-4 text-yellow-500">
                    <?= str_repeat('<i class="fa-solid fa-star"></i>', $rev['rating']) ?>
                </td>
                <td class="px-6 py-4 text-right">
                    <form method="POST" class="inline">
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= $rev['id'] ?>">
                        <button type="submit" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php require_once 'includes/footer.php'; ?>
