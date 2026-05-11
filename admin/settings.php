<?php 
require_once 'includes/header.php'; 

$keys = ['site_name', 'contact_email', 'contact_phone', 'address', 'social_facebook', 'social_twitter', 'social_instagram'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($keys as $k) {
        if (isset($_POST[$k])) {
            $stmt = $pdo->prepare("UPDATE settings SET value = ? WHERE key = ?");
            $stmt->execute([$_POST[$k], $k]);
        }
    }
    $success = "Settings updated successfully!";
}

// Fetch current
$current = [];
foreach ($keys as $k) {
    $current[$k] = getSetting($pdo, $k);
}
?>

<div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-800">Site Settings</h1>
</div>

<?php if (isset($success)): ?>
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <?= $success ?>
    </div>
<?php endif; ?>

<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <form method="POST" class="space-y-6">
        <div>
            <h3 class="text-lg font-bold border-b pb-2 mb-4">Brand Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Site Name</label>
                    <input type="text" name="site_name" value="<?= htmlspecialchars($current['site_name']) ?>" class="w-full border rounded px-3 py-2">
                </div>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-bold border-b pb-2 mb-4">Contact Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="contact_email" value="<?= htmlspecialchars($current['contact_email']) ?>" class="w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Phone</label>
                    <input type="text" name="contact_phone" value="<?= htmlspecialchars($current['contact_phone']) ?>" class="w-full border rounded px-3 py-2">
                </div>
                <div class="col-span-2">
                    <label class="block text-sm font-medium mb-1">Corporate Address</label>
                    <textarea name="address" rows="2" class="w-full border rounded px-3 py-2"><?= htmlspecialchars($current['address']) ?></textarea>
                </div>
            </div>
        </div>

        <div>
            <h3 class="text-lg font-bold border-b pb-2 mb-4">Social Media Links</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1"><i class="fa-brands fa-facebook text-blue-600"></i> Facebook</label>
                    <input type="url" name="social_facebook" value="<?= htmlspecialchars($current['social_facebook']) ?>" class="w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1"><i class="fa-brands fa-twitter text-blue-400"></i> Twitter</label>
                    <input type="url" name="social_twitter" value="<?= htmlspecialchars($current['social_twitter']) ?>" class="w-full border rounded px-3 py-2">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1"><i class="fa-brands fa-instagram text-pink-600"></i> Instagram</label>
                    <input type="url" name="social_instagram" value="<?= htmlspecialchars($current['social_instagram']) ?>" class="w-full border rounded px-3 py-2">
                </div>
            </div>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded font-medium">Save All Settings</button>
    </form>
</div>

<?php require_once 'includes/footer.php'; ?>
