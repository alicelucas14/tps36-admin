import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
    if (db) return db;
    
    db = await open({
        filename: path.join(process.cwd(), 'database.sqlite'),
        driver: sqlite3.Database
    });
    
    return db;
}

export async function getSettings() {
    const database = await getDb();
    const rows = await database.all("SELECT key, value FROM settings");
    const settingsMap: Record<string, string> = {};
    rows.forEach(r => settingsMap[r.key] = r.value);
    return settingsMap;
}
