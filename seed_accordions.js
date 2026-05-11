const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

const defaultAccordions = [
    ['How Do I Claim My Free Welcome Bonus?', 'Simply register an account, verify your details, and make your first deposit to instantly receive your 100% welcome bonus in your wallet.'],
    ['What Makes Teen Patti Stars Different?', 'We offer exclusive VIP tables, the fastest payout system in the industry, and a fully transparent gaming environment powered by certified RNG algorithms.'],
    ['What Games Can I Play?', 'Enjoy a wide variety of games including classic Teen Patti, multiple variations of Rummy, Andar Bahar, and premium slot machines.'],
    ['Is Teen Patti Stars Safe & Secure?', 'Absolutely. We use military-grade 256-bit encryption for all data and transactions to ensure complete privacy and security for our players.'],
    ['How Fast Are Payouts?', 'Withdrawals are processed instantly through IMPS, UPI, and major bank transfers. You will usually receive your funds within minutes.']
];

db.serialize(() => {
    db.get("SELECT COUNT(*) as count FROM home_accordions", (err, row) => {
        if (err) {
            console.error(err);
            return;
        }
        if (row && row.count === 0) {
            console.log("Seeding home_accordions...");
            const stmt = db.prepare('INSERT INTO home_accordions (question, answer) VALUES (?, ?)');
            defaultAccordions.forEach(a => {
                stmt.run(a);
            });
            stmt.finalize(() => {
                console.log("Done seeding.");
                db.close();
            });
        } else {
            console.log("home_accordions already has data. Skipping.");
            db.close();
        }
    });
});
