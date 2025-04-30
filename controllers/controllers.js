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
  });
};

export const createalbum = async (req, res) => {
  const db = await dbPromise;
  const { band, title, authors, releaseDate } = req.body;

  const authorsArray = await db.run("SELECT authors FROM albums");

  authorsArray.array.forEach(author => {
      if (author = authors){
        alert("There can be no albums with the same name!");
        //abortolni kellene ezt a függvényt ez után
      }
  });

  if (!band || !title || !authors || !releaseDate) {
    return res.status(400).json({ message: "Invalid input something" });
  }

  const result = await db.run(
    "INSERT INTO albums (band, title, authors, releaseDate) VALUES (?, ?, ?, ?)",
    [band, title, authors, releaseDate] 
  );

  res.status(201).json({
    id: result.lastID,
    band,
    title,
    authors,
    releaseDate,
  });
};


export const updatealbum = async (req, res) => {
  const db = await dbPromise;
  const id = parseInt(req.params.id);  // Use the database ID from the route params
  const { band, title, authors, releaseDate } = req.body; // Add missing fields

  // Validate input
  if (!band || !title || !authors || !releaseDate) {
    return res.status(400).json({ message: "Invalid input something" });
  }

  // Check if the album with the provided ID exists in the database
  const check = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  if (!check) {
    return res.status(404).json({ message: "album not found" });
  }

  // Update the album in the database
  await db.run(
    "UPDATE albums SET band = ?, title = ?, authors = ?, releaseDate = ? WHERE id = ?",
    [band,title,authors,releaseDate, id]
  );

  // Return the updated album data in the response
  res.status(201).json({
    id: check.lastID,
    band,
    title,
    authors,
    releaseDate,
  });
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

