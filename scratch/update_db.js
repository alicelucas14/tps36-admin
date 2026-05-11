const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    console.log("Updating settings table...");
    
    // Update site_name
    db.run("UPDATE settings SET value = 'Stars777 Node CMS' WHERE key = 'site_name'", (err) => {
        if (err) console.error("Error updating site_name:", err);
    });

    // Bulk replace 'uu7game' with 'stars777' in values (handles emails and social links)
    db.run("UPDATE settings SET value = REPLACE(value, 'uu7game', 'stars777')", (err) => {
        if (err) console.error("Error updating general links:", err);
        else console.log("Updated social links and emails.");
    });

    // Update session secret is done in code, but settings are for UI.
});

db.close(() => {
    console.log("Database update complete.");
});
