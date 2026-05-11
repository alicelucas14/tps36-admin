<?php require_once 'includes/header.php'; ?>

<section class="relative px-4 py-20 lg:pt-32 lg:pb-24 lg:px-8">
    <!-- Clean, Premium Orange Gradient Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#fb923c] via-[#f97316] to-[#ea580c]"></div>
    
    <div class="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 text-center lg:text-left z-10 pt-10">
            <h1 class="text-[2.75rem] md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-white leading-[1.05] drop-shadow-sm">
                <?= htmlspecialchars(getSetting($pdo, 'site_name')) ?> — Teen Patti & Rummy real cash app
            </h1>
            <p class="text-lg md:text-xl leading-relaxed text-white/90 max-w-xl mx-auto lg:mx-0 font-normal">
                Play skill-based Teen Patti and Rummy on <?= htmlspecialchars(getSetting($pdo, 'site_name')) ?> with secure payments, quick <strong class="font-bold text-white">withdrawals</strong>, and friendly 24/7 support. Download the <?= htmlspecialchars(getSetting($pdo, 'site_name')) ?> APK and start in minutes. For players 18+; play responsibly.
            </p>
            <div class="flex justify-center lg:justify-start pt-6">
                <!-- Clean Split Download Button -->
                <div class="inline-flex flex-col w-[300px] overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition duration-300 transform hover:-translate-y-1">
                    <a href="#" class="bg-gradient-to-b from-[#ffd24d] to-[#fa9d0f] text-black font-black text-lg py-4 flex items-center justify-center gap-2 cursor-pointer">
                        <i class="fa-solid fa-download text-xl"></i>
                        DOWNLOAD APP
                    </a>
                    <div class="bg-white text-black text-xs font-bold py-3 text-center leading-tight">
                        Get Cash Bonus on 1st Add<br>Cash*
                    </div>
                </div>
            </div>
        </div>
        <div class="relative z-10 flex justify-center lg:self-end">
            <div class="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl filter"></div>
            <img src="/images/hero.png" alt="Winning is a Habit" class="w-full max-w-xl lg:max-w-[110%] relative z-10 drop-shadow-2xl animate-[float_6s_ease-in-out_infinite] -mb-16 md:-mb-32 lg:-mb-48" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x800/070b14/fbbf24?text=Save+Image+Here';">
        </div>
    </div>
    
    <style>
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
    </style>
</section>

<div class="relative z-20 max-w-6xl mx-auto px-4 -mt-16 md:-mt-24 mb-20 md:mb-32">
    <div class="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 rounded-3xl shadow-[0_15px_50px_rgba(249,115,22,0.4)] p-8 md:p-10 border border-white/20 backdrop-blur-sm">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/30 text-center">
            <div class="px-4 flex flex-col justify-center">
                <h3 class="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2 tracking-tight">150K+</h3>
                <p class="text-white/90 font-bold uppercase tracking-wider text-sm">Winners</p>
            </div>
            <div class="px-4 flex flex-col justify-center">
                <h3 class="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2 tracking-tight">75M+</h3>
                <p class="text-white/90 font-bold uppercase tracking-wider text-sm">Players</p>
            </div>
            <div class="px-4 flex flex-col justify-center">
                <h3 class="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2 tracking-tight">₹5 Cr+</h3>
                <p class="text-white/90 font-bold uppercase tracking-wider text-sm">Winnings</p>
            </div>
            <div class="px-4 flex flex-col justify-center">
                <h3 class="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2 tracking-tight">24/7</h3>
                <p class="text-white/90 font-bold uppercase tracking-wider text-sm">Support</p>
            </div>
        </div>
    </div>
</div>

<?php require_once 'includes/footer.php'; ?>
