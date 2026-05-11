    </main>
    <footer class="bg-[#f97316] text-white pt-16 pb-8 border-t border-orange-500">
        <div class="max-w-7xl mx-auto px-4">
            <!-- Top 3 Columns -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                <!-- Col 1 -->
                <div>
                    <h4 class="text-yellow-400 font-black tracking-widest uppercase mb-6 drop-shadow-sm">QUICKLINKS</h4>
                    <ul class="space-y-4 font-bold text-[15px]">
                        <li><a href="index.php" class="hover:text-yellow-200 transition">Home</a></li>
                        <li><a href="blogs.php" class="hover:text-yellow-200 transition">Games</a></li>
                        <li><a href="faq.php" class="hover:text-yellow-200 transition">FAQ</a></li>
                        <li><a href="contact.php" class="hover:text-yellow-200 transition">About Us</a></li>
                    </ul>
                </div>
                
                <!-- Col 2 -->
                <div>
                    <h4 class="text-yellow-400 font-black tracking-widest uppercase mb-6 drop-shadow-sm">LEGAL</h4>
                    <ul class="space-y-4 font-bold text-[15px]">
                        <li><a href="#" class="hover:text-yellow-200 transition">Privacy Policy</a></li>
                        <li><a href="#" class="hover:text-yellow-200 transition">Terms of Service</a></li>
                        <li><a href="#" class="hover:text-yellow-200 transition">Responsible Gaming</a></li>
                    </ul>
                </div>
                
                <!-- Col 3 -->
                <div>
                    <h4 class="text-yellow-400 font-black tracking-widest uppercase mb-6 drop-shadow-sm">INTEGRITY & SECURITY</h4>
                    <ul class="space-y-4 font-bold text-[15px]">
                        <li class="flex items-center gap-3"><i class="fa-solid fa-robot text-yellow-300 w-5"></i> No Bot Guarantee</li>
                        <li class="flex items-center gap-3"><i class="fa-solid fa-shield-halved text-yellow-300 w-5"></i> ISO Certified</li>
                        <li class="flex items-center gap-3"><i class="fa-solid fa-bolt text-yellow-300 w-5"></i> Instant Withdrawal</li>
                        <li class="flex items-center gap-3"><i class="fa-solid fa-microchip text-yellow-300 w-5"></i> RNG Certified</li>
                    </ul>
                </div>
            </div>
            
            <!-- Withdrawal Partners Banner -->
            <div class="bg-[#8b4513] rounded-2xl p-6 md:px-8 md:py-6 shadow-inner border border-orange-900/40 mb-12 flex flex-col md:flex-row md:items-center gap-6">
                <h5 class="text-white font-bold text-lg whitespace-nowrap">Withdrawal Partners</h5>
                <div class="flex flex-wrap gap-3 items-center">
                    <div class="border border-orange-700/50 bg-orange-950/40 p-2 rounded-xl flex items-center justify-center shrink-0">
                        <div class="bg-white rounded px-2 py-0.5 text-xs text-blue-500 font-black italic">Paytm</div>
                    </div>
                    <div class="border border-orange-700/50 bg-orange-950/40 p-2 rounded-xl flex items-center justify-center shrink-0">
                        <div class="bg-white rounded px-2 py-0.5 text-xs text-blue-800 font-bold">RuPay</div>
                    </div>
                    <div class="border border-orange-700/50 bg-orange-950/40 p-2 rounded-xl flex items-center justify-center shrink-0">
                        <div class="bg-white rounded px-2 py-0.5 text-xs text-purple-700 font-bold">PhonePe</div>
                    </div>
                    <div class="border border-orange-700/50 bg-orange-950/40 p-2 rounded-xl flex items-center justify-center shrink-0">
                        <div class="bg-white rounded px-2 py-0.5 text-xs text-green-700 font-black italic">UPI</div>
                    </div>
                    <div class="border border-orange-700/50 bg-orange-950/40 p-2 rounded-xl flex items-center justify-center shrink-0">
                        <div class="bg-white rounded px-2 py-0.5 text-xs text-blue-900 font-black italic">VISA</div>
                    </div>
                    <div class="border border-orange-700/50 bg-orange-950/40 p-2 rounded-xl flex items-center justify-center shrink-0">
                        <i class="fa-brands fa-cc-mastercard text-white text-2xl h-5 flex items-center"></i>
                    </div>
                </div>
            </div>
            
            <!-- Bottom Legal & Socials -->
            <div class="pt-8 border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-shield text-yellow-300"></i>
                    <span class="font-bold text-white/90">UU7Game © <?= date('Y') ?>. All rights reserved.</span>
                </div>
                <div class="flex flex-wrap justify-center gap-3">
                    <?php if($fb = getSetting($pdo, 'social_facebook')): ?><a href="<?= htmlspecialchars($fb) ?>" target="_blank" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1877F2] hover:-translate-y-1 transition duration-300 shadow-lg"><i class="fa-brands fa-facebook-f text-lg"></i></a><?php endif; ?>
                    <?php if($tw = getSetting($pdo, 'social_twitter')): ?><a href="<?= htmlspecialchars($tw) ?>" target="_blank" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1DA1F2] hover:-translate-y-1 transition duration-300 shadow-lg"><i class="fa-brands fa-twitter text-lg"></i></a><?php endif; ?>
                    <?php if($ig = getSetting($pdo, 'social_instagram')): ?><a href="<?= htmlspecialchars($ig) ?>" target="_blank" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#E4405F] hover:-translate-y-1 transition duration-300 shadow-lg"><i class="fa-brands fa-instagram text-lg"></i></a><?php endif; ?>
                    <?php if($tg = getSetting($pdo, 'social_telegram')): ?><a href="<?= htmlspecialchars($tg) ?>" target="_blank" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#229ED9] hover:-translate-y-1 transition duration-300 shadow-lg"><i class="fa-brands fa-telegram text-lg"></i></a><?php endif; ?>
                    <?php if($wa = getSetting($pdo, 'social_whatsapp')): ?><a href="<?= htmlspecialchars($wa) ?>" target="_blank" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#25D366] hover:-translate-y-1 transition duration-300 shadow-lg"><i class="fa-brands fa-whatsapp text-lg"></i></a><?php endif; ?>
                    <?php if($yt = getSetting($pdo, 'social_youtube')): ?><a href="<?= htmlspecialchars($yt) ?>" target="_blank" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#FF0000] hover:-translate-y-1 transition duration-300 shadow-lg"><i class="fa-brands fa-youtube text-lg"></i></a><?php endif; ?>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>
