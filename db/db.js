import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Resolve the directory name for the database file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Open the SQLite database
const dbPromise = open({
  filename: `${__dirname}/albums.db`,
  driver: sqlite3.Database,
});

// Initialize the database and create the table
const initDB = async () => {
  const db = await dbPromise;
  
  // Create the albums table with proper SQL syntax
  await db.exec(`
  CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    band TEXT,
    title TEXT,
    authors TEXT,  -- Store authors as a JSON string
    releaseDate DATE
  );
  `);
};

await initDB();
export default dbPromise;
