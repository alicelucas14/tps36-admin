<?php require_once 'includes/header.php'; 
$email = getSetting($pdo, 'contact_email');
$phone = getSetting($pdo, 'contact_phone');
$address = getSetting($pdo, 'address');
?>

<div class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-16">
        <h1 class="text-4xl font-bold mb-4">Contact Us</h1>
        <p class="text-gray-400">Reach out to us for any concerns or business inquiries.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="bg-accent rounded-xl p-8 border border-white/5 text-center hover:border-secondary transition shadow-lg py-12">
            <div class="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i class="fa-solid fa-envelope"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Email Access</h3>
            <p class="text-secondary"><?= htmlspecialchars($email) ?: 'Not set' ?></p>
        </div>
        
        <div class="bg-accent rounded-xl p-8 border border-white/5 text-center hover:border-secondary transition shadow-lg py-12">
            <div class="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i class="fa-solid fa-phone"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Call Us</h3>
            <p class="text-secondary"><?= htmlspecialchars($phone) ?: 'Not set' ?></p>
        </div>
        
        <div class="bg-accent rounded-xl p-8 border border-white/5 text-center hover:border-secondary transition shadow-lg py-12">
            <div class="w-16 h-16 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                <i class="fa-solid fa-location-dot"></i>
            </div>
            <h3 class="font-bold text-xl mb-2">Office Address</h3>
            <p class="text-secondary text-sm"><?= nl2br(htmlspecialchars($address)) ?: 'Not set' ?></p>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
