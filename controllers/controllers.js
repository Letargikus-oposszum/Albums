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
  let { band, title, authors, releaseDate } = req.body;

  if (!band || !title || !authors || !releaseDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (Array.isArray(authors)) {
    authors = authors.join(", ");
  } else if (typeof authors === "object") {
    authors = JSON.stringify(authors);
  }

  const existingAlbums = await db.all("SELECT title, authors FROM albums");
  const albumExists = existingAlbums.some(
    row => row.title === title && row.authors === authors
  );

  if (albumExists) {
    return res.status(400).json({ message: "An album with the same title and authors already exists!" });
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
  const id = parseInt(req.params.id);  
  const { band, title, authors, releaseDate } = req.body; 

  if (!band || !title || !authors || !releaseDate) {
    return res.status(400).json({ message: "Invalid input something" });
  }

  const check = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  if (!check) {
    return res.status(404).json({ message: "album not found" });
  }

  await db.run(
    "UPDATE albums SET band = ?, title = ?, authors = ?, releaseDate = ? WHERE id = ?",
    [band,title,authors,releaseDate, id]
  );

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
  const id = parseInt(req.params.id);  

  const check = await db.get("SELECT * FROM albums WHERE id = ?", [id]);
  if (!check) {
    return res.status(404).json({ message: "album not found" });
  }

  await db.run("DELETE FROM albums WHERE id = ?", [id]);

  res.status(200).json({ message: "Delete successful" });
};

