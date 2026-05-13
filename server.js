// Load environment variables from .env file (install dotenv in production: npm install dotenv)
try { require('dotenv').config(); } catch(e) { /* dotenv not installed — using defaults */ }

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');

const PORT = process.env.PORT || 8000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'tp_stars_dev_secret_change_me_in_production_2024';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';
const NODE_ENV = process.env.NODE_ENV || 'development';


// Copy generated image if it exists
try {
    const src = 'C:\\Users\\teenp\\.gemini\\antigravity\\brain\\0add1e5e-4d72-4e8d-959a-abbc6d338eb2\\casino_phone_burst_1778349947228.png';
    const dest = path.join(__dirname, 'public', 'images', 'casino_phone_burst.png');
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
    }
} catch(e) {}

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const app = express();
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Note: CATEGORIES is now moved to the database for dynamic management.
// We will initialize it in the DB seeding block below.
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: COOKIE_SECURE,     // true in production (HTTPS)
        httpOnly: true,            // Prevents JS access to session cookie
        maxAge: 1000 * 60 * 60 * 8 // 8 hour session timeout
    }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Security Headers ──────────────────────────────────────────
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (NODE_ENV === 'production') {
        // HSTS — only in production over HTTPS
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
});

// ── Rate Limiter & Malicious Blocker ──────────────────────────
const requestCounts = new Map();
app.use((req, res, next) => {
    // 1. Block obvious malicious paths (directory traversal, common exploits)
    const maliciousPaths = [/\.\.\//i, /\.env/i, /\.git/i, /wp-admin/i, /phpmyadmin/i, /<script>/i];
    if (maliciousPaths.some(pattern => pattern.test(req.url))) {
        return res.status(403).send('Forbidden: Malicious path detected.');
    }

    // 2. Simple Rate Limiting (100 requests per minute per IP)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000;
    const maxRequests = 100;

    let userObj = requestCounts.get(ip);
    if (!userObj || userObj.resetTime < now) {
        userObj = { count: 1, resetTime: now + windowMs };
        requestCounts.set(ip, userObj);
    } else {
        userObj.count++;
        if (userObj.count > maxRequests) {
            return res.status(429).send('Too Many Requests. Please try again later.');
        }
    }
    
    // Clean up map occasionally to prevent memory leak
    if (Math.random() < 0.01) {
        for (const [key, val] of requestCounts.entries()) {
            if (val.resetTime < now) requestCounts.delete(key);
        }
    }
    
    next();
});

// Inject current path for active link highlighting and global public data
app.use((req, res, next) => {
    res.locals.path = req.path;
    
    // Only fetch for public HTML pages
    if (!req.path.startsWith('/admin') && !req.path.startsWith('/api') && !req.path.includes('.')) {
        db.all("SELECT * FROM withdrawal_partners ORDER BY created_at ASC", (err, rows) => {
            res.locals.withdrawalPartners = rows || [];
            next();
        });
    } else {
        next();
    }
});

// Block ALL /admin routes from search engine indexing
app.use('/admin', (req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    next();
});

// robots.txt — block admin and API from all crawlers
app.get('/robots.txt', async (req, res) => {
    const settings = await getSettings();
    const base = (settings['seo_base_url'] || '').replace(/\/$/, '');
    const txt = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /admin/login\nDisallow: /admin/logout\n${base ? `\nSitemap: ${base}/sitemap.xml` : ''}`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(txt);
});

// Dynamic sitemap.xml
app.get('/sitemap.xml', async (req, res) => {
    const settings = await getSettings();
    const base = (settings['seo_base_url'] || 'https://teenpattistars.com').replace(/\/$/, '');
    const now = new Date().toISOString().split('T')[0];

    const staticPages = [
        { url: '/', priority: '1.0', freq: 'daily' },
        { url: '/blogs', priority: '0.9', freq: 'weekly' },
        { url: '/reviews', priority: '0.8', freq: 'weekly' },
        { url: '/faq', priority: '0.7', freq: 'monthly' },
        { url: '/contact', priority: '0.6', freq: 'monthly' },
        { url: '/privacy-policy', priority: '0.4', freq: 'yearly' },
        { url: '/terms-and-conditions', priority: '0.4', freq: 'yearly' },
    ];

    db.all("SELECT slug, created_at FROM blogs ORDER BY created_at DESC", (err, blogs) => {
        const blogUrls = (blogs || []).map(b => ({
            url: `/blogs/${b.slug}`,
            priority: '0.7',
            freq: 'monthly',
            date: b.created_at ? b.created_at.split(' ')[0] : now
        }));

        const allPages = [...staticPages, ...blogUrls];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <lastmod>${p.date || now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
        res.setHeader('Content-Type', 'application/xml');
        res.send(xml);
    });
});

// Visitor Tracking Middleware (Tracks Unique Public Visits)
app.use((req, res, next) => {
    if (req.path.startsWith('/admin') || req.path.startsWith('/api') || req.path.includes('.')) return next();
    
    // Extract IP address from headers or connection
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
    // Normalize localhost
    if (ip === '::1') ip = '127.0.0.1';
    
    // Check if IP exists
    db.get("SELECT id FROM visitors WHERE ip_address = ?", [ip], (err, row) => {
        if (!row) {
            // New visitor: Quickly insert to prevent race conditions, then fetch location async
            db.run("INSERT INTO visitors (ip_address) VALUES (?)", [ip], function(err) {
                if (!err) {
                    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
                        // It's a local development IP, mock the location so it looks nice for testing
                        db.run("UPDATE visitors SET country = ?, city = ? WHERE ip_address = ?", ['Local Network', 'Developer Machine', ip]);
                    } else {
                        // Fetch real location asynchronously for live internet users
                        fetch(`http://ip-api.com/json/${ip}`)
                            .then(res => res.json())
                            .then(data => {
                                if (data.status === 'success') {
                                    db.run("UPDATE visitors SET country = ?, city = ? WHERE ip_address = ?", [data.country, data.city, ip]);
                                }
                            }).catch(() => {}); // Silent fail
                    }
                }
            });
        } else {
            // Existing visitor: Update last_visited & increment roughly (optional)
            db.run("UPDATE visitors SET visits = visits + 1, last_visited = CURRENT_TIMESTAMP WHERE ip_address = ?", [ip]);
        }
    });
    next();
});

// Initialize Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error("DB Error:", err);
});

// Auto-create tables
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        category TEXT DEFAULT 'General',
        external_link TEXT DEFAULT '',
        status TEXT DEFAULT 'Published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // Add views column if it doesn't exist (fails silently if it does)
    db.run("ALTER TABLE blogs ADD COLUMN views INTEGER DEFAULT 0", () => {});

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewer_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'Published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS faqs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_address TEXT UNIQUE NOT NULL,
        country TEXT DEFAULT 'Unknown',
        city TEXT DEFAULT 'Unknown',
        visits INTEGER DEFAULT 1,
        last_visited DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS button_clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        element_text TEXT NOT NULL,
        page_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);


    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        message TEXT,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS home_accordions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS withdrawal_partners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chat_qa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chat_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'bot',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS contact_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subtitle TEXT,
        title TEXT NOT NULL,
        description TEXT,
        button_text TEXT,
        button_link TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS popup_banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image_url TEXT NOT NULL,
        link_url TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS checkout_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        step_number INTEGER DEFAULT 1,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        image_url_2 TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Fix existing local IPs that are marked as 'Unknown' from initial testing
    db.run("UPDATE visitors SET country = 'Local Network', city = 'Developer Machine' WHERE ip_address IN ('127.0.0.1', '::1') AND country = 'Unknown'");

    // Safely add new columns to existing tables (ALTER TABLE is ignored if column already exists via error catch)
    db.run("ALTER TABLE blogs ADD COLUMN external_link TEXT DEFAULT ''", () => {});
    db.run("ALTER TABLE blogs ADD COLUMN link_text TEXT DEFAULT ''", () => {});
    db.run("ALTER TABLE promotions ADD COLUMN external_link TEXT DEFAULT ''", () => {});
    db.run("ALTER TABLE promotions ADD COLUMN link_text TEXT DEFAULT ''", () => {});
    db.run("ALTER TABLE popup_banners ADD COLUMN title TEXT DEFAULT ''", () => {});

    db.run("ALTER TABLE checkout_steps ADD COLUMN image_url_2 TEXT", () => {});

    // Insert or ignore default settings (INSERT OR IGNORE ensures new keys are added without overwriting existing ones)
    const defaults = [
        ['site_name', 'Stars777 Node CMS'],
        ['contact_email', 'support@stars777.com'],
        ['contact_phone', '+1234567890'],
        ['address', '123 Gaming Street, NY'],
        ['social_facebook', 'https://facebook.com/stars777'],
        ['social_twitter', 'https://twitter.com/stars777'],
        ['social_instagram', 'https://instagram.com/stars777'],
        ['social_telegram', 'https://t.me/stars777'],
        ['social_whatsapp', 'https://wa.me/1234567890'],
        ['social_youtube', 'https://youtube.com/@stars777'],
        ['social_x', 'https://x.com/stars777'],
        ['social_telegram_channel', 'https://t.me/stars777_channel'],
        ['about_us_content', `<p>Welcome to <span class="text-white font-bold">Stars777</span> – India's number one choice for online gaming, player happiness, and seamless interaction! Discover why we're featured among the <span class="text-secondary font-bold">top Indian Rummy websites every player should know.</span></p><p>At Stars777, we are passionate about delivering <strong class="text-white font-semibold">the ultimate gaming experience</strong> by offering a diverse range of <strong class="text-white font-semibold">Indian lottery games, skill-based games,</strong> and <strong class="text-white font-semibold">casino entertainment</strong> that includes popular options like Rummy and Teen Patti.</p><p>Our platform is designed for gaming enthusiasts who value <strong class="text-white font-semibold">quick withdrawals, security,</strong> and a trusted environment where <strong class="text-white font-semibold">fun meets fairness.</strong> Whether you're a fan of <strong class="text-white font-semibold">Indian lotteries</strong>, a skilled player of <strong class="text-white font-semibold">Rummy</strong> and <strong class="text-white font-semibold">Teen Patti</strong>, or love the excitement of <strong class="text-white font-semibold">casino games</strong>, Stars777 has something for everyone.</p>` ],
        ['home_accordion_image', '/images/hero.png'],
        ['contact_faq_image', '/images/casino_phone_burst.png'],
        ['privacy_policy', '<h2>Privacy Policy</h2><p>Welcome to Teen Patti Stars. We are committed to protecting your personal information and your right to privacy. This policy outlines how we collect, use, and safeguard your data.</p><h3>Information We Collect</h3><p>We may collect information such as your name, email address, phone number, and payment details when you register or interact with our platform.</p><h3>How We Use Your Information</h3><p>Your information is used to process transactions, manage your account, provide customer support, and improve our services.</p><h3>Data Security</h3><p>We implement industry-standard security measures to protect your personal data from unauthorized access, alteration, or disclosure.</p><h3>Contact Us</h3><p>If you have any questions about this Privacy Policy, please contact our support team.</p>'],
        ['terms_conditions', '<h2>Terms &amp; Conditions</h2><p>By accessing and using Teen Patti Stars, you agree to be bound by these Terms and Conditions. Please read them carefully before using our platform.</p><h3>Eligibility</h3><p>You must be at least 18 years of age to use our platform. By using our services, you confirm that you meet this age requirement and that all information you provide is accurate.</p><h3>Account Responsibility</h3><p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p><h3>Fair Play</h3><p>All games on our platform are skill-based. Any form of cheating, collusion, or fraudulent activity will result in immediate account suspension and forfeiture of funds.</p><h3>Withdrawals & Payments</h3><p>Withdrawals are subject to identity verification. We reserve the right to withhold funds pending verification or if suspicious activity is detected.</p><h3>Changes to Terms</h3><p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>'],
        ['checkout_content', '<h2>Checkout</h2><p>Provide your checkout content here.</p>'],
        ['seo_base_url', 'https://teenpattistars.com'],
        ['seo_default_keywords', 'Teen Patti Stars, Teen Patti, Rummy, online gaming, card games, real cash games, casino India'],
        ['seo_og_image', '/images/Teen-Patti-Stars-Logo.webp'],
        ['seo_robots', 'index, follow'],
        ['seo_google_analytics', ''],
        ['seo_google_verification', ''],
        ['seo_facebook_pixel', ''],
        ['seo_home_title', 'Teen Patti Stars - Premium Online Gaming'],
        ['seo_home_description', 'Play Teen Patti, Rummy & Casino games on Teen Patti Stars. Secure payments, instant withdrawals, and 24/7 VIP support.'],
        ['seo_home_keywords', 'Teen Patti Stars, Teen Patti online, Rummy cash games, casino India'],
        ['seo_blogs_title', 'Gaming Guides & News'],
        ['seo_blogs_description', 'Read the latest gaming guides, tips, and news from Teen Patti Stars.'],
        ['seo_reviews_title', 'Player Reviews'],
        ['seo_reviews_description', 'See what players are saying about Teen Patti Stars. Read genuine reviews from our community.'],
        ['seo_faq_title', 'Frequently Asked Questions'],
        ['seo_faq_description', 'Find answers to the most common questions about Teen Patti Stars gaming platform.'],
        ['chat_enabled', '1'],
        ['chat_bot_name', 'Stars Support Bot'],
        ['chat_agent_name', 'Live Agent'],
        ['chat_welcome_message', 'Hey there! 👋 Welcome to Teen Patti Stars! How can I help you today?'],
        ['chat_telegram_link', 'https://t.me/stars777'],
        ['chat_custom_qa', ''],
        ['telegram_bot_token', ''],
        ['telegram_agent_chat_id', ''],
        ['admin_registration_key', 'TPS-ADMIN-2024'],
        ['apk_file_url', '#'],
        ['ios_app_url', '#']
    ];
    const defStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    defaults.forEach(d => defStmt.run(d));
    defStmt.finalize();

    // Default Categories
    const defaultCats = ['General', 'Slots Games', 'Rummy Games', 'Sports', 'Live Casino'];
    const catStmt = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    defaultCats.forEach(c => catStmt.run(c));
    catStmt.finalize();

    // Admin Users table
    db.run(`CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    // Seed default admin user (password: admin123) — uses SHA-256 hash
    const defaultHash = require('crypto').createHash('sha256').update('admin123').digest('hex');
    db.run("INSERT OR IGNORE INTO admin_users (username, password_hash, role) VALUES (?, ?, 'superadmin')", ['admin', defaultHash]);

    // Default Home Accordions
    db.get("SELECT COUNT(*) as count FROM home_accordions", (err, row) => {
        if (row && row.count === 0) {
            const defaultAccordions = [
                ['How Do I Claim My Free Welcome Bonus?', 'Simply register an account, verify your details, and make your first deposit to instantly receive your 100% welcome bonus in your wallet.'],
                ['What Makes Teen Patti Stars Different?', 'We offer exclusive VIP tables, the fastest payout system in the industry, and a fully transparent gaming environment powered by certified RNG algorithms.'],
                ['What Games Can I Play?', 'Enjoy a wide variety of games including classic Teen Patti, multiple variations of Rummy, Andar Bahar, and premium slot machines.'],
                ['Is Teen Patti Stars Safe & Secure?', 'Absolutely. We use military-grade 256-bit encryption for all data and transactions to ensure complete privacy and security for our players.'],
                ['How Fast Are Payouts?', 'Withdrawals are processed instantly through IMPS, UPI, and major bank transfers. You will usually receive your funds within minutes.']
            ];
            const accStmt = db.prepare('INSERT INTO home_accordions (question, answer) VALUES (?, ?)');
            defaultAccordions.forEach(a => accStmt.run(a));
            accStmt.finalize();
        }
    });

    // Default Contact Cards
    db.get("SELECT COUNT(*) as count FROM contact_cards", (err, row) => {
        if (row && row.count === 0) {
            const defaultContactCards = [
                ['Instant Help', 'Live Chat', 'Our friendly support team is available 24/7 via live chat.', 'Chat Now', '#', ''],
                ['Contact Us', 'E-Mail', 'Send us an email at support@vegascasinoonline.eu. We\'ll get back to you within 24 hours.', 'Send E-Mail', 'mailto:support@vegascasinoonline.eu', ''],
                ['Let\'s Talk', 'Call Back', 'Prefer a classic touch? Schedule a call and we\'ll give you a ring at a time that suits you best.', 'Schedule A Call', '#', '']
            ];
            const ccStmt = db.prepare('INSERT INTO contact_cards (subtitle, title, description, button_text, button_link, image_url) VALUES (?, ?, ?, ?, ?, ?)');
            defaultContactCards.forEach(c => ccStmt.run(c));
            ccStmt.finalize();
        }
    });

    // Default Withdrawal Partners
    db.get("SELECT COUNT(*) as count FROM withdrawal_partners", (err, row) => {
        if (row && row.count === 0) {
            const defaultPartners = [
                ['Visa', '/uploads/visa.png'],
                ['Mastercard', '/uploads/mastercard.png'],
                ['Bitcoin', '/uploads/bitcoin.png'],
                ['Bitcoin Cash', '/uploads/bitcoincash.png'],
                ['Lightning', '/uploads/lightning.png'],
                ['Litecoin', '/uploads/litecoin.png'],
                ['Ethereum', '/uploads/ethereum.png'],
                ['Interac', '/uploads/interac.png']
            ];
            const wpStmt = db.prepare('INSERT INTO withdrawal_partners (name, image_url) VALUES (?, ?)');
            defaultPartners.forEach(p => wpStmt.run(p));
            wpStmt.finalize();
        }
    });
});

// Helper Functions
const logActivity = (action, details = '') => {
    db.run("INSERT INTO activity_log (action, details) VALUES (?, ?)", [action, details]);
};

const crypto = require('crypto');

// ── Live Chat Infrastructure ──────────────────────────────────
// SSE connections: sessionId → response object
const sseClients = {};

// Send a message via Telegram Bot API
async function sendToTelegram(token, chatId, text) {
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
        });
    } catch(e) { /* silent */ }
}

// Push a message to a browser SSE client
function pushToClient(sessionId, payload) {
    const client = sseClients[sessionId];
    if (client) {
        try { client.write(`data: ${JSON.stringify(payload)}\n\n`); } catch(e) {}
    }
}

// Telegram long-polling (works in dev without a public URL)
let tgOffset = 0;
async function pollTelegram() {
    try {
        const settings = await getSettings();
        const token = settings['telegram_bot_token'];
        const agentChatId = String(settings['telegram_agent_chat_id'] || '');
        if (!token || !agentChatId) { setTimeout(pollTelegram, 8000); return; }

        const resp = await fetch(
            `https://api.telegram.org/bot${token}/getUpdates?offset=${tgOffset}&timeout=5`,
            { signal: AbortSignal.timeout(8000) }
        );
        const data = await resp.json();

        if (data.ok && data.result && data.result.length > 0) {
            for (const update of data.result) {
                tgOffset = update.update_id + 1;
                const msg = update.message;
                if (!msg) continue;
                if (String(msg.chat.id) !== agentChatId) continue;

                // Handle photo from agent
                if (msg.photo) {
                    const photo = msg.photo[msg.photo.length - 1];
                    try {
                        const fr = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${photo.file_id}`);
                        const fd = await fr.json();
                        if (fd.ok) {
                            const fileUrl = `https://api.telegram.org/file/bot${token}/${fd.result.file_path}`;
                            const ir = await fetch(fileUrl);
                            const buf = Buffer.from(await ir.arrayBuffer());
                            const fname = `tg_${Date.now()}.jpg`;
                            fs.writeFileSync(path.join(__dirname, 'public/uploads', fname), buf);
                            const localUrl = `/uploads/${fname}`;
                            db.get("SELECT session_id FROM chat_sessions WHERE status='agent' ORDER BY created_at DESC LIMIT 1", (e, s) => {
                                if (!s) return;
                                const payload = `[IMAGE:${localUrl}]`;
                                db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'agent', ?)", [s.session_id, payload]);
                                pushToClient(s.session_id, { sender: 'agent', message: payload });
                            });
                        }
                    } catch(pe) { /* silent */ }
                    continue;
                }

                // Handle text from agent
                if (!msg.text || msg.text.startsWith('/')) continue;
                const agentText = msg.text;
                db.get(
                    "SELECT session_id FROM chat_sessions WHERE status = 'agent' ORDER BY created_at DESC LIMIT 1",
                    (err, session) => {
                        if (!session) return;
                        const sid = session.session_id;
                        db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'agent', ?)", [sid, agentText]);
                        pushToClient(sid, { sender: 'agent', message: agentText });
                    }
                );
            }
        }
    } catch(e) { /* silent */ }
    setTimeout(pollTelegram, 3000);
}
// Start polling after a short delay so DB is ready
setTimeout(pollTelegram, 4000);

const getCategories = () => {
    return new Promise((resolve) => {
        db.all("SELECT name FROM categories ORDER BY name ASC", (err, rows) => {
            resolve(rows ? rows.map(r => r.name) : []);
        });
    });
};
const getSettings = () => {
    return new Promise((resolve) => {
        db.all("SELECT key, value FROM settings", (err, rows) => {
            let settingsMap = {};
            if (rows) rows.forEach(r => settingsMap[r.key] = r.value);
            resolve(settingsMap);
        });
    });
};

const getWithdrawalPartners = () => {
    return new Promise((resolve) => {
        db.all("SELECT * FROM withdrawal_partners ORDER BY created_at ASC", (err, rows) => {
            resolve(rows || []);
        });
    });
};

// ================= LIVE CHAT API =================

app.get('/api/chat-data', async (req, res) => {
    const settings = await getSettings();
    res.json({
        enabled: settings['chat_enabled'] === '1',
        botName: settings['chat_bot_name'] || 'Support Bot',
        agentName: settings['chat_agent_name'] || 'Live Agent',
        avatar: settings['chat_avatar'] || '',
        welcomeMessage: settings['chat_welcome_message'] || 'Hello! How can I help you today?'
    });
});

app.post('/api/chat/session', (req, res) => {
    const existingId = req.body.sessionId;
    if (existingId) {
        db.get("SELECT session_id, status FROM chat_sessions WHERE session_id = ?", [existingId], (err, session) => {
            if (session) return res.json({ sessionId: session.session_id, status: session.status });
            createNewSession();
        });
    } else {
        createNewSession();
    }
    
    function createNewSession() {
        const sessionId = require('crypto').randomUUID();
        db.run("INSERT INTO chat_sessions (session_id, status) VALUES (?, 'bot')", [sessionId], () => {
            res.json({ sessionId, status: 'bot' });
        });
    }
});

app.get('/api/chat/stream/:sessionId', (req, res) => {
    const sid = req.params.sessionId;
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({type: 'connected'})}\n\n`);
    sseClients[sid] = res;
    req.on('close', () => { delete sseClients[sid]; });
});

app.post('/api/chat/send', async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) return res.status(400).json({ error: 'Missing data' });

    db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'user', ?)", [sessionId, message]);

    db.get("SELECT status FROM chat_sessions WHERE session_id = ?", [sessionId], async (err, session) => {
        if (!session) return res.status(404).json({ error: 'Session not found' });
        
        if (session.status === 'agent') {
            // Forward directly to Telegram
            const settings = await getSettings();
            const token = settings['telegram_bot_token'];
            const agentChatId = settings['telegram_agent_chat_id'];
            if (token && agentChatId) {
                await sendToTelegram(token, agentChatId, `<b>User says:</b>\n${message}`);
            }
            return res.json({ type: 'forwarded' });
        } else {
            // Bot logic
            const msgLower = message.toLowerCase();
            const triggers = ['agent', 'human', 'speak to someone', 'talk to someone', 'live support', 'real person', 'representative', 'operator'];
            if (triggers.some(t => msgLower.includes(t))) {
                db.run("UPDATE chat_sessions SET status = 'agent' WHERE session_id = ?", [sessionId]);
                
                const settings = await getSettings();
                const token = settings['telegram_bot_token'];
                const agentChatId = settings['telegram_agent_chat_id'];
                if (token && agentChatId) {
                    await sendToTelegram(token, agentChatId, `🚨 <b>Agent Requested!</b>\nA user requested human support.\nUser says: ${message}`);
                }
                const reply = "I am transferring you to a human agent. They will reply here shortly.";
                db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'bot', ?)", [sessionId, reply]);
                return res.json({ type: 'bot', message: reply, escalated: true });
            }

            // Check QA
            db.all("SELECT * FROM chat_qa", (err, qaRows) => {
                let reply = "I'm not sure about that. Try asking something else, or ask to speak to an agent.";
                for (const row of (qaRows || [])) {
                    if (msgLower.includes(row.keyword.toLowerCase())) {
                        reply = row.answer;
                        break;
                    }
                }
                db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'bot', ?)", [sessionId, reply]);
                res.json({ type: 'bot', message: reply, escalated: false });
            });
        }
    });
});

app.post('/api/chat/upload', upload.single('image'), async (req, res) => {
    const { sessionId } = req.body;
    if (!req.file || !sessionId) return res.status(400).json({ error: 'Upload failed' });
    
    const imageUrl = `/uploads/${req.file.filename}`;
    db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'user', ?)", [sessionId, `[IMAGE:${imageUrl}]`]);
    
    // Check if in agent mode to forward image
    db.get("SELECT status FROM chat_sessions WHERE session_id = ?", [sessionId], async (err, session) => {
        if (session && session.status === 'agent') {
            const settings = await getSettings();
            const token = settings['telegram_bot_token'];
            const agentChatId = settings['telegram_agent_chat_id'];
            if (token && agentChatId) {
                // Send an image link to Telegram
                const host = req.protocol + '://' + req.get('host');
                await sendToTelegram(token, agentChatId, `<b>User sent an image:</b>\n${host}${imageUrl}`);
            }
        }
    });

    res.json({ url: imageUrl });
});


// ================= PUBLIC ROUTES =================
app.get('/', async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 3", (err, featuredBlogs) => {
        db.all("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 3", (err, recentReviews) => {
            db.all("SELECT * FROM faqs ORDER BY created_at ASC LIMIT 4", (err, faqPreview) => {
                db.all("SELECT * FROM home_accordions ORDER BY created_at ASC", (err, homeAccordions) => {
                    db.all("SELECT * FROM popup_banners WHERE is_active = 1 ORDER BY created_at DESC LIMIT 3", (err, popupBanners) => {
                        res.render('index', { 
                            settings, 
                            featuredBlogs: featuredBlogs || [], 
                            recentReviews: recentReviews || [],
                            faqPreview: faqPreview || [],
                            homeAccordions: homeAccordions || [],
                            popupBanners: popupBanners || [],
                            pageTitle: settings['seo_home_title'],
                            pageDescription: settings['seo_home_description']
                        });
                    });
                });
            });
        });
    });
});

app.get('/blogs', async (req, res) => {
    const settings = await getSettings();
    const category = req.query.category;
    let query = "SELECT * FROM blogs ORDER BY created_at DESC";
    let params = [];
    if (category && category !== 'All') {
        query = "SELECT * FROM blogs WHERE category = ? ORDER BY created_at DESC";
        params = [category];
    }
    const categories = await getCategories();
    db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 4", (err, recentBlogs) => {
        db.all(query, params, (err, blogs) => {
            res.render('blogs', { 
                settings, 
                blogs: blogs || [], 
                categories, 
                currentCategory: category || 'All', 
                recentBlogs: recentBlogs || [],
                pageTitle: settings['seo_blogs_title'],
                pageDescription: settings['seo_blogs_description']
            });
        });
    });
});

app.get('/reviews', async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM reviews ORDER BY created_at DESC", (err, reviews) => {
        res.render('reviews', { 
            settings, 
            reviews: reviews || [],
            pageTitle: settings['seo_reviews_title'],
            pageDescription: settings['seo_reviews_description']
        });
    });
});

app.get('/faq', async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM faqs ORDER BY created_at ASC", (err, faqs) => {
        res.render('faq', { 
            settings, 
            faqs: faqs || [],
            pageTitle: settings['seo_faq_title'],
            pageDescription: settings['seo_faq_description']
        });
    });
});

app.get('/:slug', async (req, res, next) => {
    // Ignore static files and API/admin routes to prevent unnecessary DB queries
    if (req.params.slug.includes('.') || req.params.slug.startsWith('api') || req.params.slug.startsWith('admin')) {
        return next();
    }

    db.get("SELECT * FROM blogs WHERE slug = ?", [req.params.slug], async (err, blog) => {
        if (!blog) return next(); // Not a blog post, pass to next matching route

        // Increment views safely
        db.run("UPDATE blogs SET views = views + 1 WHERE id = ?", [blog.id], (err) => {
            if (err) console.error("Error updating views:", err);
        });
        blog.views = (blog.views || 0) + 1;

        const settings = await getSettings();
        const categories = await getCategories();
        db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 4", (err, recentBlogs) => {
            res.render('blog_single', { 
                blog, 
                settings, 
                categories, 
                currentCategory: blog.category || 'General', 
                recentBlogs: recentBlogs || [],
                pageTitle: blog.title,
                pageDescription: blog.content.replace(/<[^>]+>/g, '').substring(0, 150).trim() + '...'
            });
        });
    });
});

app.get('/contact', async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM contact_cards ORDER BY created_at ASC", (err, contactCards) => {
        db.all("SELECT * FROM faqs ORDER BY created_at ASC LIMIT 5", (err, faqs) => {
            res.render('contact', { 
                settings, 
                success: false, 
                faqs: faqs || [], 
                contactCards: contactCards || [],
                pageTitle: "Contact Us",
                pageDescription: "Get in touch with the Teen Patti Stars support team. We offer 24/7 assistance for all your gaming needs, account inquiries, and withdrawal questions."
            });
        });
    });
});

app.post('/contact', async (req, res) => {
    const { first_name, last_name, email, message } = req.body;
    
    db.run("INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)", 
        [first_name, last_name, email, message], (err) => {
            if (err) console.error("Error saving contact message:", err);
            logActivity('Contact Form Submission', `Message from ${first_name} ${last_name} (${email})`);
        });
    
    // Re-render contact page with success message
    const settings = await getSettings();
    res.render('contact', { settings, success: true });
});


// ── LIVE CHAT API ROUTES ──────────────────────────────────────

// 1. Create or reconnect to a session
app.post('/api/chat/session', (req, res) => {
    const sessionId = req.body.sessionId || crypto.randomBytes(12).toString('hex');
    db.get("SELECT session_id, status FROM chat_sessions WHERE session_id = ?", [sessionId], (err, row) => {
        if (row) return res.json({ sessionId: row.session_id, status: row.status });
        db.run("INSERT INTO chat_sessions (session_id) VALUES (?)", [sessionId], () => {
            res.json({ sessionId, status: 'bot' });
        });
    });
});

// 2. User sends a message
app.post('/api/chat/send', async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) return res.status(400).json({ error: 'Missing fields' });

    // Save user message
    db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'user', ?)", [sessionId, message]);

    db.get("SELECT status FROM chat_sessions WHERE session_id = ?", [sessionId], async (err, session) => {
        if (!session) return res.json({ type: 'bot', message: 'Session expired. Please refresh.' });

        // Agent mode: forward to Telegram
        if (session.status === 'agent') {
            const settings = await getSettings();
            const token = settings['telegram_bot_token'];
            const agentChatId = settings['telegram_agent_chat_id'];
            if (token && agentChatId) {
                await sendToTelegram(token, agentChatId,
                    `💬 <b>Customer [${sessionId.slice(0,6)}]:</b>\n${message}`);
            }
            return res.json({ type: 'forwarded' });
        }

        // Bot mode: check agent trigger keywords
        const lower = message.toLowerCase();
        const agentTriggers = ['agent','human','speak to someone','talk to someone','live support','real person','representative','operator'];
        if (agentTriggers.some(t => lower.includes(t))) {
            db.run("UPDATE chat_sessions SET status = 'agent' WHERE session_id = ?", [sessionId]);
            const settings = await getSettings();
            const token = settings['telegram_bot_token'];
            const agentChatId = settings['telegram_agent_chat_id'];
            const agentName = settings['chat_agent_name'] || 'Live Agent';

            if (token && agentChatId) {
                db.all("SELECT sender, message FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC LIMIT 8",
                    [sessionId], async (e, history) => {
                        const log = (history || []).map(m =>
                            `${m.sender === 'user' ? '👤' : '🤖'} ${m.message}`).join('\n');
                        await sendToTelegram(token, agentChatId,
                            `🆕 <b>New Support Request</b>\n<b>Session:</b> ${sessionId.slice(0,6)}\n\n<b>Chat History:</b>\n${log}\n\n─────────────\nReply here to respond to the customer.`);
                    });
            }

            const botMsg = `Connecting you with a ${agentName} now! 🎯 They'll reply here in a moment — please wait.`;
            db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'bot', ?)", [sessionId, botMsg]);
            return res.json({ type: 'bot', message: botMsg, escalated: true });
        }

        // Bot mode: search Q&A knowledge base
        db.all("SELECT keyword, answer FROM chat_qa", (e, qaRows) => {
            db.all("SELECT question, answer FROM faqs", (e2, faqs) => {
                const kb = [
                    ...(qaRows||[]).map(r => ({ q: r.keyword.toLowerCase(), a: r.answer })),
                    ...(faqs||[]).map(f => ({ q: f.question.toLowerCase(), a: f.answer.replace(/<[^>]*>/g,'') })),
                    { q: 'hello', a: 'Hello! 👋 How can I assist you today?' },
                    { q: 'hi', a: 'Hi there! 😊 What can I help you with?' },
                    { q: 'thanks', a: "You're welcome! Anything else I can help with? 😊" },
                    { q: 'bye', a: 'Goodbye! Have a great day! 🎉' }
                ];
                const match = kb.find(item => lower.includes(item.q) ||
                    item.q.split(' ').some(w => w.length > 3 && lower.includes(w)));
                const botReply = match
                    ? match.a
                    : "I'm not sure about that. Would you like me to connect you with a live agent?";
                db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'bot', ?)", [sessionId, botReply]);
                res.json({ type: 'bot', message: botReply });
            });
        });
    });
});

// 3. SSE stream — browser listens here for real-time agent messages
app.get('/api/chat/stream/:sessionId', (req, res) => {
    const sid = req.params.sessionId;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    sseClients[sid] = res;
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
    const ping = setInterval(() => { try { res.write(':ping\n\n'); } catch(e) { clearInterval(ping); } }, 25000);
    req.on('close', () => { clearInterval(ping); delete sseClients[sid]; });
});

// 4. Image upload from chat widget → saved + forwarded to Telegram
app.post('/api/chat/upload', upload.single('image'), async (req, res) => {
    const { sessionId } = req.body;
    if (!sessionId || !req.file) return res.status(400).json({ error: 'Missing data' });

    const localUrl = '/uploads/' + req.file.filename;
    const payload = `[IMAGE:${localUrl}]`;
    db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'user', ?)", [sessionId, payload]);

    // Forward image to Telegram agent
    const settings = await getSettings();
    const token = settings['telegram_bot_token'];
    const agentChatId = settings['telegram_agent_chat_id'];
    if (token && agentChatId) {
        try {
            const FormData = (await import('node:stream')).PassThrough; // native
            const { default: fd } = await import('form-data').catch(() => ({ default: null }));
            // Use fetch with multipart manually
            const boundary = '----FormBoundary' + Date.now();
            const fileBuffer = fs.readFileSync(req.file.path);
            const body = Buffer.concat([
                Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="chat_id"\r\n\r\n${agentChatId}\r\n`),
                Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="caption"\r\n\r\n📸 Customer [${sessionId.slice(0,6)}] sent a screenshot\r\n`),
                Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="${req.file.filename}"\r\nContent-Type: ${req.file.mimetype}\r\n\r\n`),
                fileBuffer,
                Buffer.from(`\r\n--${boundary}--\r\n`)
            ]);
            await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
                body
            });
        } catch(e) { /* silent */ }
    }

    res.json({ url: localUrl });
});

// 5. Telegram webhook (for production with HTTPS — optional, polling also works)
app.post('/api/telegram-webhook', async (req, res) => {
    res.sendStatus(200);
    const update = req.body;
    if (!update.message || !update.message.text) return;
    const settings = await getSettings();
    const agentChatId = String(settings['telegram_agent_chat_id'] || '');
    if (String(update.message.chat.id) !== agentChatId) return;
    const text = update.message.text;
    if (text.startsWith('/')) return;
    db.get("SELECT session_id FROM chat_sessions WHERE status='agent' ORDER BY created_at DESC LIMIT 1", (e, s) => {
        if (!s) return;
        db.run("INSERT INTO chat_messages (session_id, sender, message) VALUES (?, 'agent', ?)", [s.session_id, text]);
        pushToClient(s.session_id, { sender: 'agent', message: text });
    });
});


// PUBLIC API: Chat widget data
app.get('/api/chat-data', async (req, res) => {
    const settings = await getSettings();
    if (settings['chat_enabled'] !== '1') return res.json({ enabled: false });
    db.all("SELECT keyword, answer FROM chat_qa ORDER BY created_at ASC", (err, qaRows) => {
        db.all("SELECT question, answer FROM faqs", (err2, faqs) => {
            res.json({
                enabled: true,
                botName: settings['chat_bot_name'] || 'Support Bot',
                agentName: settings['chat_agent_name'] || 'Live Agent',
                welcomeMessage: settings['chat_welcome_message'] || 'Hello! How can I help you?',
                telegramLink: settings['chat_telegram_link'] || '',
                avatar: settings['chat_avatar'] || '',
                qaRows: (qaRows || []).map(r => ({ q: r.keyword, a: r.answer })),
                faqs: (faqs || []).map(f => ({ q: f.question, a: f.answer }))
            });
        });
    });
});

app.get('/privacy-policy', async (req, res) => {
    const settings = await getSettings();
    res.render('privacy-policy', {
        settings,
        pageTitle: "Privacy Policy",
        pageDescription: "Read the Teen Patti Stars privacy policy to understand how we collect, use, and protect your personal information."
    });
});

app.get('/checkout', async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM checkout_steps ORDER BY step_number ASC, id ASC", (err, steps) => {
        res.render('checkout', {
            settings,
            steps: steps || [],
            pageTitle: "Checkout",
            pageDescription: "Checkout page for Teen Patti Stars."
        });
    });
});

app.get('/terms-and-conditions', async (req, res) => {
    const settings = await getSettings();
    res.render('terms-and-conditions', {
        settings,
        pageTitle: "Terms & Conditions",
        pageDescription: "Read the Teen Patti Stars terms and conditions before using our platform and gaming services."
    });
});

app.get('/sitemap.xml', (req, res) => {
    const baseUrl = 'https://stars777.com';
    db.all("SELECT slug, created_at FROM blogs WHERE status = 'Published' ORDER BY created_at DESC", (err, blogs) => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        // Add static routes
        const routes = [
            { path: '/', priority: '1.0', changefreq: 'daily' },
            { path: '/blogs', priority: '0.8', changefreq: 'daily' },
            { path: '/reviews', priority: '0.8', changefreq: 'weekly' },
            { path: '/faq', priority: '0.7', changefreq: 'monthly' },
            { path: '/contact', priority: '0.9', changefreq: 'yearly' }
        ];
        
        routes.forEach(route => {
            xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
        });
        
        // Add dynamic blog posts
        if (blogs) {
            blogs.forEach(blog => {
                const date = new Date(blog.created_at).toISOString().split('T')[0];
                xml += `  <url>\n    <loc>${baseUrl}/${blog.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
            });
        }
        
        xml += '</urlset>';
        
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
});


// ================= ADMIN ROUTES =================
// Inject session data into all views
app.use((req, res, next) => {
    res.locals.isSuperAdmin = !!(req.session && req.session.adminUser && req.session.adminUser.role === 'superadmin');
    res.locals.currentAdminUser = req.session && req.session.adminUser ? req.session.adminUser : null;
    next();
});

// Auth Middleware
const requireAuth = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.redirect('/admin/login');
};

app.get('/admin/login', (req, res) => {
    res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const hash = require('crypto').createHash('sha256').update(password || '').digest('hex');
    db.get("SELECT * FROM admin_users WHERE username = ? AND password_hash = ?", [username, hash], (err, user) => {
        if (user) {
            req.session.isAdmin = true;
            req.session.adminUser = { id: user.id, username: user.username, role: user.role };
            logActivity('Login', `Admin "${username}" logged in successfully`);
            res.redirect('/admin');
        } else {
            logActivity('Login Attempt', `Failed login attempt with username: ${username}`);
            res.render('admin/login', { error: 'Invalid username or password' });
        }
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Self-registration page
app.get('/admin/register', (req, res) => {
    res.render('admin/register', { error: null, success: null });
});

app.post('/admin/register', (req, res) => {
    const { username, password, confirm_password, registration_key } = req.body;
    if (!username || !password) return res.render('admin/register', { error: 'Username and password are required.', success: null });
    if (password !== confirm_password) return res.render('admin/register', { error: 'Passwords do not match.', success: null });
    if (password.length < 6) return res.render('admin/register', { error: 'Password must be at least 6 characters.', success: null });

    db.get("SELECT value FROM settings WHERE key = 'admin_registration_key'", (err, row) => {
        const validKey = row ? row.value : 'TPS-ADMIN-2024';
        if (!registration_key || registration_key.trim() !== validKey) {
            return res.render('admin/register', { error: 'Invalid registration key. Contact your administrator.', success: null });
        }
        const hash = require('crypto').createHash('sha256').update(password).digest('hex');
        db.run("INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, 'admin')", [username.trim(), hash], (dbErr) => {
            if (dbErr) return res.render('admin/register', { error: 'Username already taken. Choose another.', success: null });
            logActivity('User Registered', `New admin account "${username}" self-registered`);
            res.render('admin/register', { error: null, success: 'Account created! You can now log in.' });
        });
    });
});

// ── User Management (superadmin only) ───────────────────────
const requireSuperAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin && req.session.adminUser && req.session.adminUser.role === 'superadmin') {
        return next();
    }
    return res.redirect('/admin?error=Access+denied');
};

app.get('/admin/users', requireSuperAdmin, (req, res) => {
    db.all("SELECT id, username, role, created_at FROM admin_users ORDER BY created_at ASC", (err, users) => {
        res.render('admin/users', { users: users || [], currentUser: req.session.adminUser, success: req.query.success, error: req.query.error });
    });
});

// Create new user
app.post('/admin/users/create', requireSuperAdmin, (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.redirect('/admin/users?error=Username+and+password+are+required');
    const hash = require('crypto').createHash('sha256').update(password).digest('hex');
    db.run("INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)", [username.trim(), hash, role || 'admin'], (err) => {
        if (err) return res.redirect('/admin/users?error=Username+already+exists');
        logActivity('User Created', `New admin user "${username}" created`);
        res.redirect('/admin/users?success=User+created+successfully');
    });
});

// Change password
app.post('/admin/users/change-password', requireSuperAdmin, (req, res) => {
    const { user_id, new_password, confirm_password } = req.body;
    if (!new_password || new_password !== confirm_password)
        return res.redirect('/admin/users?error=Passwords+do+not+match');
    if (new_password.length < 6)
        return res.redirect('/admin/users?error=Password+must+be+at+least+6+characters');
    const hash = require('crypto').createHash('sha256').update(new_password).digest('hex');
    db.run("UPDATE admin_users SET password_hash = ? WHERE id = ?", [hash, user_id], (err) => {
        if (err) return res.redirect('/admin/users?error=Failed+to+update+password');
        logActivity('Password Changed', `Password changed for user ID ${user_id}`);
        res.redirect('/admin/users?success=Password+updated+successfully');
    });
});

// Delete user
app.post('/admin/users/delete', requireSuperAdmin, (req, res) => {
    const { user_id } = req.body;
    // Prevent deleting yourself
    if (req.session.adminUser && String(req.session.adminUser.id) === String(user_id))
        return res.redirect('/admin/users?error=You+cannot+delete+your+own+account');
    db.run("DELETE FROM admin_users WHERE id = ?", [user_id], (err) => {
        logActivity('User Deleted', `Admin user ID ${user_id} deleted`);
        res.redirect('/admin/users?success=User+deleted');
    });
});

app.post('/api/track-click', (req, res) => {
    const { text, url } = req.body;
    if (text && url) {
        db.run("INSERT INTO button_clicks (element_text, page_url) VALUES (?, ?)", [text, url], err => {
            if (err) console.error("Error tracking click:", err);
        });
    }
    res.json({ success: true });
});

app.get('/admin', requireAuth, (req, res) => {
    db.serialize(() => {
        let stats = { blogs: 0, reviews: 0, faqs: 0, categories: 0, unique_visitors: 0, total_clicks: 0 };
        db.get("SELECT COUNT(*) as c FROM blogs", (err, row) => stats.blogs = row.c);
        db.get("SELECT COUNT(*) as c FROM reviews", (err, row) => stats.reviews = row.c);
        db.get("SELECT COUNT(*) as c FROM faqs", (err, row) => stats.faqs = row.c);
        db.get("SELECT COUNT(*) as c FROM categories", (err, row) => stats.categories = row.c);
        db.get("SELECT COUNT(*) as c FROM visitors", (err, row) => stats.unique_visitors = row.c);
        db.get("SELECT COUNT(*) as c FROM button_clicks", (err, row) => stats.total_clicks = row.c);
        db.get("SELECT COUNT(*) as c FROM contacts", (err, row) => stats.contacts = row.c);
        
        db.all("SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5", (err, recentBlogs) => {
            db.all("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 5", (err, recentReviews) => {
                db.all("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 10", (err, activities) => {
                    db.all("SELECT * FROM visitors ORDER BY last_visited DESC LIMIT 5", (err, recentVisitors) => {
                        db.all("SELECT element_text, COUNT(*) as clicks FROM button_clicks GROUP BY element_text ORDER BY clicks DESC LIMIT 5", (err, topClicks) => {
                            res.render('admin/index', { stats, recentBlogs, recentReviews, activities, recentVisitors: recentVisitors || [], topClicks: topClicks || [] });
                        });
                    });
                });
            });
        });
    });
});

// ADMIN: Rich Text Image Upload
app.post('/admin/upload-image', requireAuth, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    res.json({ url: '/uploads/' + req.file.filename });
});

// ADMIN: Blogs
app.get('/admin/blogs', requireAuth, async (req, res) => {
    const editId = req.query.edit_id;
    const categories = await getCategories();
    db.all("SELECT * FROM blogs ORDER BY created_at DESC", (err, blogs) => {
        const editItem = editId && blogs ? blogs.find(b => b.id.toString() === editId) : null;
        res.render('admin/blogs', { blogs: blogs || [], editItem, categories });
    });
});

app.post('/admin/blogs', requireAuth, upload.single('image'), (req, res) => {
    if (req.body.action === 'delete') {
        db.run("DELETE FROM blogs WHERE id = ?", [req.body.id], () => {
            logActivity('Delete Blog', `Deleted blog with ID: ${req.body.id}`);
            res.redirect('/admin/blogs');
        });
    } else if (req.body.action === 'edit') {
        const { id, title, content, existing_image, category, external_link, link_text } = req.body;
        const image_url = req.file ? '/uploads/' + req.file.filename : existing_image;
        db.run("UPDATE blogs SET title = ?, content = ?, image_url = ?, category = ? WHERE id = ?",
            [title, content, image_url, category || 'General', id], (err) => {
            // Also try to update rich text fields (safe - ignores if columns don't exist)
            if (!err) db.run("UPDATE blogs SET external_link = ?, link_text = ? WHERE id = ?", [external_link || '', link_text || '', id], () => {});
            if (err) console.error(err);
            logActivity('Edit Blog', `Updated blog: ${title}`);
            res.redirect('/admin/blogs');
        });
    } else {
        const { title, content, category, external_link, link_text } = req.body;
        const image_url = req.file ? '/uploads/' + req.file.filename : '';
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        db.run("INSERT OR IGNORE INTO blogs (title, slug, content, image_url, category) VALUES (?, ?, ?, ?, ?)",
            [title, slug, content, image_url, category || 'General'], function(err) {
            if (err) { console.error(err); return res.redirect('/admin/blogs'); }
            // Try to set rich text fields after insert
            db.run("UPDATE blogs SET external_link = ?, link_text = ? WHERE id = ?", [external_link || '', link_text || '', this.lastID], () => {});
            logActivity('Add Blog', `Created new blog: ${title}`);
            res.redirect('/admin/blogs');
        });
    }
});

// ADMIN: Categories
app.get('/admin/categories', requireAuth, (req, res) => {
    const editId = req.query.edit_id;
    db.all("SELECT * FROM categories ORDER BY name ASC", (err, categories) => {
        const editItem = editId && categories ? categories.find(c => c.id.toString() === editId) : null;
        res.render('admin/categories', { categories: categories || [], editItem });
    });
});

app.post('/admin/categories', requireAuth, (req, res) => {
    const { action, id, name } = req.body;
    if (action === 'delete') {
        db.run("DELETE FROM categories WHERE id = ?", [id], () => {
            logActivity('Delete Category', `Deleted category ID: ${id}`);
            res.redirect('/admin/categories');
        });
    } else if (action === 'edit') {
        db.run("UPDATE categories SET name = ? WHERE id = ?", [name, id], () => {
            logActivity('Edit Category', `Updated category to: ${name}`);
            res.redirect('/admin/categories');
        });
    } else {
        db.run("INSERT INTO categories (name) VALUES (?)", [name], () => {
            logActivity('Add Category', `Created category: ${name}`);
            res.redirect('/admin/categories');
        });
    }
});

// ADMIN: Reviews
app.get('/admin/reviews', requireAuth, (req, res) => {
    const editId = req.query.edit_id;
    db.all("SELECT * FROM reviews ORDER BY created_at DESC", (err, reviews) => {
        const editItem = editId && reviews ? reviews.find(r => r.id.toString() === editId) : null;
        res.render('admin/reviews', { reviews: reviews || [], editItem });
    });
});
app.post('/admin/reviews', requireAuth, upload.single('image'), (req, res) => {
    if (req.body.action === 'delete') {
        db.run("DELETE FROM reviews WHERE id = ?", [req.body.id], () => {
            logActivity('Delete Review', `Deleted review from ID: ${req.body.id}`);
            res.redirect('/admin/reviews');
        });
    } else if (req.body.action === 'edit') {
        const { id, reviewer_name, rating, comment, existing_image } = req.body;
        const image_url = req.file ? '/uploads/' + req.file.filename : existing_image;
        db.run("UPDATE reviews SET reviewer_name = ?, rating = ?, comment = ?, image_url = ? WHERE id = ?", [reviewer_name, rating, comment, image_url, id], (err) => {
            if (err) console.error(err);
            logActivity('Edit Review', `Updated review by: ${reviewer_name}`);
            res.redirect('/admin/reviews');
        });
    } else {
        const { reviewer_name, rating, comment } = req.body;
        const image_url = req.file ? '/uploads/' + req.file.filename : '';
        db.run("INSERT INTO reviews (reviewer_name, rating, comment, image_url) VALUES (?, ?, ?, ?)", [reviewer_name, rating, comment, image_url], (err) => {
            if (err) console.error(err);
            logActivity('Add Review', `Created review by: ${reviewer_name}`);
            res.redirect('/admin/reviews');
        });
    }
});

// ADMIN: FAQs
app.get('/admin/faq', requireAuth, (req, res) => {
    const editId = req.query.edit_id;
    db.all("SELECT * FROM faqs ORDER BY created_at ASC", (err, faqs) => {
        const editItem = editId && faqs ? faqs.find(f => f.id.toString() === editId) : null;
        res.render('admin/faq', { faqs: faqs || [], editItem });
    });
});
app.post('/admin/faq', requireAuth, upload.single('image'), (req, res) => {
    if (req.body.action === 'delete') {
        db.run("DELETE FROM faqs WHERE id = ?", [req.body.id], () => {
            logActivity('Delete FAQ', `Deleted FAQ ID: ${req.body.id}`);
            res.redirect('/admin/faq');
        });
    } else if (req.body.action === 'edit') {
        const { id, question, answer, existing_image } = req.body;
        const image_url = req.file ? '/uploads/' + req.file.filename : existing_image;
        db.run("UPDATE faqs SET question = ?, answer = ?, image_url = ? WHERE id = ?", [question, answer, image_url, id], (err) => {
            if (err) console.error(err);
            logActivity('Edit FAQ', `Updated FAQ: ${question}`);
            res.redirect('/admin/faq');
        });
    } else {
        const { question, answer } = req.body;
        const image_url = req.file ? '/uploads/' + req.file.filename : '';
        db.run("INSERT INTO faqs (question, answer, image_url) VALUES (?, ?, ?)", [question, answer, image_url], (err) => {
            if (err) console.error(err);
            logActivity('Add FAQ', `Created FAQ: ${question}`);
            res.redirect('/admin/faq');
        });
    }
});


// ADMIN: Contacts
app.get('/admin/contacts', requireAuth, (req, res) => {
    const { start_date, end_date } = req.query;
    let query = "SELECT * FROM contacts";
    let params = [];
    
    if (start_date && end_date) {
        query += " WHERE date(created_at) >= ? AND date(created_at) <= ?";
        params = [start_date, end_date];
    } else if (start_date) {
        query += " WHERE date(created_at) >= ?";
        params = [start_date];
    } else if (end_date) {
        query += " WHERE date(created_at) <= ?";
        params = [end_date];
    }
    
    query += " ORDER BY created_at DESC";
    
    db.all(query, params, (err, contacts) => {
        res.render('admin/contacts', { contacts: contacts || [], start_date: start_date || '', end_date: end_date || '' });
    });
});

app.get('/admin/contacts/export', requireAuth, (req, res) => {
    const { start_date, end_date } = req.query;
    let query = "SELECT * FROM contacts";
    let params = [];
    
    if (start_date && end_date) {
        query += " WHERE date(created_at) >= ? AND date(created_at) <= ?";
        params = [start_date, end_date];
    } else if (start_date) {
        query += " WHERE date(created_at) >= ?";
        params = [start_date];
    } else if (end_date) {
        query += " WHERE date(created_at) <= ?";
        params = [end_date];
    }
    
    query += " ORDER BY created_at DESC";
    
    db.all(query, params, (err, contacts) => {
        if (err) return res.status(500).send("Database error");
        
        let csv = "Date,First Name,Last Name,Email,Status,Message\n";
        (contacts || []).forEach(row => {
            const date = new Date(row.created_at).toLocaleString().replace(/,/g, '');
            const fName = (row.first_name || '').replace(/"/g, '""');
            const lName = (row.last_name || '').replace(/"/g, '""');
            const email = (row.email || '').replace(/"/g, '""');
            const status = (row.status || '').replace(/"/g, '""');
            const msg = (row.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
            
            csv += `${date},"${fName}","${lName}","${email}","${status}","${msg}"\n`;
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="contacts_export.csv"');
        res.send(csv);
    });
});

app.post('/admin/contacts/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], () => {
        logActivity('Delete Contact Message', `Deleted message ID: ${req.params.id}`);
        res.redirect('/admin/contacts');
    });
});

// ADMIN: Settings
app.get('/admin/settings', requireAuth, async (req, res) => {
    const settings = await getSettings();
    res.render('admin/settings', { settings, success: false });
});
app.post('/admin/settings', requireAuth, upload.any(), (req, res) => {
    const keys = ['site_name', 'contact_email', 'contact_phone', 'address', 'social_facebook', 'social_twitter', 'social_instagram', 'social_telegram', 'social_whatsapp', 'social_youtube', 'social_x', 'social_telegram_channel', 'about_us_content', 'home_accordion_image', 'contact_faq_image', 'privacy_policy', 'terms_conditions', 'apk_file_url', 'ios_app_url', 'checkout_content'];
    const stmt = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
    
    // Update text fields
    keys.forEach(k => {
        if (req.body[k] !== undefined) stmt.run([req.body[k], k]);
    });

    // Handle file uploads directly to settings keys
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            if (keys.includes(file.fieldname)) {
                stmt.run(['/uploads/' + file.filename, file.fieldname]);
            }
        });
    }

    stmt.finalize(() => {
        logActivity('Update Settings', 'Site settings updated');
        const referrer = req.get('Referrer');
        if (referrer && !referrer.endsWith('/admin/settings')) {
            res.redirect(referrer);
        } else {
            getSettings().then(settings => {
                res.render('admin/settings', { settings, success: true });
            });
        }
    });
});

// ADMIN: SEO
app.get('/admin/seo', requireAuth, async (req, res) => {
    const settings = await getSettings();
    res.render('admin/seo', { settings, success: req.query.saved === '1' });
});
app.post('/admin/seo', requireAuth, (req, res) => {
    const keys = [
        'seo_base_url', 'seo_default_keywords', 'seo_og_image', 'seo_robots',
        'seo_google_analytics', 'seo_google_verification', 'seo_facebook_pixel',
        'seo_home_title', 'seo_home_description', 'seo_home_keywords',
        'seo_blogs_title', 'seo_blogs_description',
        'seo_reviews_title', 'seo_reviews_description',
        'seo_faq_title', 'seo_faq_description'
    ];
    const stmt = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
    keys.forEach(k => {
        // INSERT OR REPLACE for new keys
        db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [k, req.body[k] || '']);
    });
    stmt.finalize(() => {});
    logActivity('Update SEO', 'SEO settings updated');
    res.redirect('/admin/seo?saved=1');
});

// ADMIN: Live Chat Settings
app.get('/admin/chat', requireAuth, async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM chat_qa ORDER BY created_at ASC", (err, qaRows) => {
        res.render('admin/chat', { settings, qaRows: qaRows || [], success: req.query.saved === '1' });
    });
});
app.post('/admin/chat', requireAuth, upload.single('chat_avatar_file'), (req, res) => {
    const keys = ['chat_enabled', 'chat_bot_name', 'chat_agent_name', 'chat_welcome_message', 'chat_telegram_link', 'telegram_bot_token', 'telegram_agent_chat_id'];
    keys.forEach(k => {
        db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [k, req.body[k] || '']);
    });
    // Handle avatar image upload
    if (req.file) {
        db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", ['chat_avatar', '/uploads/' + req.file.filename]);
    }
    logActivity('Update Chat Settings', 'Live chat settings updated');
    res.redirect('/admin/chat?saved=1');
});


// ADMIN: Chat Q&A CRUD
app.post('/admin/chat/qa/add', requireAuth, (req, res) => {
    const { keyword, answer } = req.body;
    if (!keyword || !answer) return res.redirect('/admin/chat?saved=0');
    db.run("INSERT INTO chat_qa (keyword, answer) VALUES (?, ?)", [keyword.trim(), answer.trim()], () => {
        logActivity('Add Chat Q&A', `Keyword: ${keyword}`);
        res.redirect('/admin/chat?saved=1');
    });
});
app.post('/admin/chat/qa/update/:id', requireAuth, (req, res) => {
    const { keyword, answer } = req.body;
    db.run("UPDATE chat_qa SET keyword = ?, answer = ? WHERE id = ?", [keyword.trim(), answer.trim(), req.params.id], () => {
        res.redirect('/admin/chat?saved=1');
    });
});
app.post('/admin/chat/qa/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM chat_qa WHERE id = ?", [req.params.id], () => {
        res.redirect('/admin/chat?saved=1');
    });
});


// ADMIN: Home Accordions
app.get('/admin/home-accordions', requireAuth, async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM home_accordions ORDER BY created_at ASC", (err, accordions) => {
        res.render('admin/home_accordions', { path: req.path, accordions: accordions || [], settings, success: false, error: null });
    });
});

app.post('/admin/home-accordions', requireAuth, (req, res) => {
    const { question, answer } = req.body;
    db.run("INSERT INTO home_accordions (question, answer) VALUES (?, ?)", [question, answer], (err) => {
        logActivity('Add Home Accordion', `Question: ${question}`);
        res.redirect('/admin/home-accordions');
    });
});

app.post('/admin/home-accordions/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM home_accordions WHERE id = ?", [req.params.id], (err) => {
        logActivity('Delete Home Accordion', `Deleted accordion ID: ${req.params.id}`);
        res.redirect('/admin/home-accordions');
    });
});

app.get('/admin/home-accordions/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM home_accordions WHERE id = ?", [req.params.id], (err, accordion) => {
        if (!accordion) return res.redirect('/admin/home-accordions');
        res.render('admin/home_accordion_form', { path: '/admin/home-accordions', accordion, error: null });
    });
});

app.post('/admin/home-accordions/edit/:id', requireAuth, (req, res) => {
    const { question, answer } = req.body;
    db.run("UPDATE home_accordions SET question = ?, answer = ? WHERE id = ?", 
        [question, answer, req.params.id], (err) => {
            logActivity('Edit Home Accordion', `Updated accordion ID: ${req.params.id}`);
            res.redirect('/admin/home-accordions');
        });
});

// ADMIN: Withdrawal Partners
app.get('/admin/withdrawal-partners', requireAuth, (req, res) => {
    db.all("SELECT * FROM withdrawal_partners ORDER BY created_at ASC", (err, partners) => {
        res.render('admin/withdrawal_partners', { path: req.path, partners: partners || [], success: false, error: null });
    });
});

app.post('/admin/withdrawal-partners', requireAuth, upload.single('image'), (req, res) => {
    const { name } = req.body;
    if (!req.file || !name) return res.redirect('/admin/withdrawal-partners');
    
    const image_url = '/uploads/' + req.file.filename;
    db.run("INSERT INTO withdrawal_partners (name, image_url) VALUES (?, ?)", [name, image_url], (err) => {
        logActivity('Add Withdrawal Partner', `Partner: ${name}`);
        res.redirect('/admin/withdrawal-partners');
    });
});

app.post('/admin/withdrawal-partners/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM withdrawal_partners WHERE id = ?", [req.params.id], (err) => {
        logActivity('Delete Withdrawal Partner', `Deleted partner ID: ${req.params.id}`);
        res.redirect('/admin/withdrawal-partners');
    });
});

// ADMIN: Popup Banners
app.get('/admin/popup-banners', requireAuth, async (req, res) => {
    db.all("SELECT * FROM popup_banners ORDER BY created_at DESC", (err, banners) => {
        res.render('admin/popup_banners', { path: req.path, banners: banners || [], success: false, error: null });
    });
});

app.post('/admin/popup-banners', requireAuth, upload.single('image'), (req, res) => {
    const { title, link_url, is_active } = req.body;
    const image_url = req.file ? '/uploads/' + req.file.filename : '';
    if (!image_url) {
        return res.redirect('/admin/popup-banners');
    }
    db.run("INSERT INTO popup_banners (title, image_url, link_url, is_active) VALUES (?, ?, ?, ?)", 
        [title || '', image_url, link_url || '', is_active ? 1 : 0], (err) => {
            logActivity('Add Popup Banner', `Added new promo banner`);
            res.redirect('/admin/popup-banners');
        });
});

app.get('/admin/popup-banners/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM popup_banners WHERE id = ?", [req.params.id], (err, banner) => {
        if (!banner) return res.redirect('/admin/popup-banners');
        res.render('admin/popup_banner_form', { path: '/admin/popup-banners', banner, error: null });
    });
});

app.post('/admin/popup-banners/edit/:id', requireAuth, upload.single('image'), (req, res) => {
    const { title, link_url, is_active, existing_image } = req.body;
    const image_url = req.file ? '/uploads/' + req.file.filename : existing_image;
    
    db.run("UPDATE popup_banners SET title = ?, image_url = ?, link_url = ?, is_active = ? WHERE id = ?", 
        [title || '', image_url, link_url || '', is_active ? 1 : 0, req.params.id], (err) => {
            logActivity('Edit Popup Banner', `Updated banner ID: ${req.params.id}`);
            res.redirect('/admin/popup-banners');
        });
});

app.post('/admin/popup-banners/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM popup_banners WHERE id = ?", [req.params.id], (err) => {
        logActivity('Delete Popup Banner', `Deleted banner ID: ${req.params.id}`);
        res.redirect('/admin/popup-banners');
    });
});

app.post('/admin/popup-banners/toggle/:id', requireAuth, (req, res) => {
    const { is_active } = req.body;
    db.run("UPDATE popup_banners SET is_active = ? WHERE id = ?", [is_active ? 1 : 0, req.params.id], (err) => {
        res.redirect('/admin/popup-banners');
    });
});

// ADMIN: Contact Page Cards
app.get('/admin/contact-page', requireAuth, async (req, res) => {
    const settings = await getSettings();
    db.all("SELECT * FROM contact_cards ORDER BY created_at ASC", (err, cards) => {
        res.render('admin/contact_page', { path: req.path, settings, cards: cards || [], error: null });
    });
});

app.post('/admin/contact-page/card', requireAuth, upload.single('image'), (req, res) => {
    const { subtitle, title, description, button_text, button_link } = req.body;
    const image_url = req.file ? '/uploads/' + req.file.filename : '';
    db.run("INSERT INTO contact_cards (subtitle, title, description, button_text, button_link, image_url) VALUES (?, ?, ?, ?, ?, ?)", 
        [subtitle, title, description, button_text, button_link, image_url], (err) => {
            logActivity('Add Contact Card', `Added card: ${title}`);
            res.redirect('/admin/contact-page');
        });
});

app.get('/admin/contact-page/card/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM contact_cards WHERE id = ?", [req.params.id], (err, card) => {
        if (!card) return res.redirect('/admin/contact-page');
        res.render('admin/contact_card_form', { path: '/admin/contact-page', card, error: null });
    });
});

app.post('/admin/contact-page/card/edit/:id', requireAuth, upload.single('image'), (req, res) => {
    const { subtitle, title, description, button_text, button_link, existing_image } = req.body;
    const image_url = req.file ? '/uploads/' + req.file.filename : existing_image;
    db.run("UPDATE contact_cards SET subtitle = ?, title = ?, description = ?, button_text = ?, button_link = ?, image_url = ? WHERE id = ?", 
        [subtitle, title, description, button_text, button_link, image_url, req.params.id], (err) => {
            logActivity('Edit Contact Card', `Updated card: ${title}`);
            res.redirect('/admin/contact-page');
        });
});

app.post('/admin/contact-page/card/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM contact_cards WHERE id = ?", [req.params.id], (err) => {
        logActivity('Delete Contact Card', `Deleted card ID: ${req.params.id}`);
        res.redirect('/admin/contact-page');
    });
});

// ADMIN: Checkout Steps
app.get('/admin/checkout-steps', requireAuth, (req, res) => {
    db.all("SELECT * FROM checkout_steps ORDER BY step_number ASC, id ASC", (err, steps) => {
        res.render('admin/checkout_steps', { path: req.path, steps: steps || [], error: null });
    });
});

app.post('/admin/checkout-steps', requireAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), (req, res) => {
    const { step_number, title, description } = req.body;
    const image_url = req.files && req.files['image'] ? '/uploads/' + req.files['image'][0].filename : null;
    const image_url_2 = req.files && req.files['image2'] ? '/uploads/' + req.files['image2'][0].filename : null;
    
    db.run("INSERT INTO checkout_steps (step_number, title, description, image_url, image_url_2) VALUES (?, ?, ?, ?, ?)", 
        [step_number || 1, title, description, image_url, image_url_2], (err) => {
        logActivity('Add Checkout Step', `Added step: ${title}`);
        res.redirect('/admin/checkout-steps');
    });
});

app.get('/admin/checkout-steps/edit/:id', requireAuth, (req, res) => {
    db.get("SELECT * FROM checkout_steps WHERE id = ?", [req.params.id], (err, step) => {
        if (!step) return res.redirect('/admin/checkout-steps');
        res.render('admin/checkout_step_form', { path: '/admin/checkout-steps', step, error: null });
    });
});

app.post('/admin/checkout-steps/edit/:id', requireAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), (req, res) => {
    const { step_number, title, description, existing_image, existing_image_2 } = req.body;
    const image_url = req.files && req.files['image'] ? '/uploads/' + req.files['image'][0].filename : existing_image;
    const image_url_2 = req.files && req.files['image2'] ? '/uploads/' + req.files['image2'][0].filename : existing_image_2;
    
    db.run("UPDATE checkout_steps SET step_number = ?, title = ?, description = ?, image_url = ?, image_url_2 = ? WHERE id = ?", 
        [step_number || 1, title, description, image_url, image_url_2, req.params.id], (err) => {
        logActivity('Edit Checkout Step', `Updated step: ${title}`);
        res.redirect('/admin/checkout-steps');
    });
});

app.post('/admin/checkout-steps/delete/:id', requireAuth, (req, res) => {
    db.run("DELETE FROM checkout_steps WHERE id = ?", [req.params.id], (err) => {
        logActivity('Delete Checkout Step', `Deleted step ID: ${req.params.id}`);
        res.redirect('/admin/checkout-steps');
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Teen Patti Stars running at http://localhost:${PORT} [${NODE_ENV.toUpperCase()}]`);
});

