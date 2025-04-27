import dbPromise from "../db/db.js";

export const getalbum = async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM albums");

  const result = rows.map(row => ({
    id: row.id,
    band: row.band,
    title: row.title,
    authors: row.authors,
    releaseDate: row.releaseDate,
    albums: JSON.parse(row.album_list),
  }));

  res.status(200).json(result);
};

export const getalbumById = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);
  const row = await db.get("SELECT * FROM albums WHERE id = ?", [id]);

  if (!row) return res.status(404).json({ message: "album not found" });

  res.status(200).json({
    id: row.id,
    band: row.band,
    title: row.title,
    authors: row.authors,
    releaseDate: row.releaseDate,
    albums: JSON.parse(row.album_list),
  });
};

export const createalbum = async (req, res) => {
  const db = await dbPromise;
  const { day, albums } = req.body;

  if (!band ||!title ||!authors ||!releaseDate || !Array.isArray(albums)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const result = await db.run(
    "INSERT INTO albums (day, album_list) VALUES (?, ?)",
    [day, JSON.stringify(albums)]
  );

  res.status(201).json({ id: result.lastID, 
                          band: row.band,
                          title: row.title,
                          authors: row.authors,
                          releaseDate: row.releaseDate, albums });
};
export const updatealbum = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);  // Use the database ID from the route params
  const { day, albums } = req.body;   // Extract day and albums from the request body

  // Validate input
  if (!day || !Array.isArray(albums)) {
    return res.status(400).json({ message: "Invalid input. Day and albums are required." });
  }

  // Check if the album with the provided ID exists in the database
  const check = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  if (!check) {
    return res.status(404).json({ message: "album not found" });
  }

  // Update the album in the database
  await db.run(
    "UPDATE albums SET day = ?, album_list = ? WHERE id = ?",
    [day, JSON.stringify(albums), id]
  );

  // Return the updated album data in the response
  res.status(200).json({ id, day, albums });
};
export const deletealbum = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);  // Use the database ID from the route params

  // Check if the album with the provided ID exists in the database
  const check = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  if (!check) {
    return res.status(404).json({ message: "album not found" });
  }

  // Delete the album from the database
  await db.run("DELETE FROM albums WHERE id = ?", [id]);

  // Respond with a success message
  res.status(200).json({ message: "Delete successful" });
};

