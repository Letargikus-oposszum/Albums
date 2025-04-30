

import dbPromise from "../db/db";

// zenekar, album címe és legyen még plusz két adat 
const seed = async () => {
    const db = await dbPromise;
    const albums = [
      { band: "KISS", title: "I was made for lovin' you baby", authors: "Pityu, Béla, János", releaseDate: "1976.03.14" },
      { band: "AC/DC", title: "Something good", authors: "Szakállvágó, OliVér", releaseDate: "1996.03.19" },
      { band: "GermanDrugAddict", title: "I am the Horseman", authors: "Scooter", releaseDate: "2006.04.14" },
      { band: "Despicable", title: "Tell me why", authors: "Ain, Nothing, But, A, Mistake", releaseDate: "2015.10.01" },
      { band: "Me", title: "My guy", authors: "Half life-os budi", releaseDate: "2018.02.09" },
    ];
  
    try {
      for (const entry of albums) {
        await db.run(`
          INSERT INTO albums (band, title, authors, releaseDate)
          VALUES (?, ?, ?, ?)`, 
          [entry.band, entry.title, entry.authors, entry.releaseDate]);
      }
      console.log("Albums seeded successfully!");
    } catch (err) {
      console.error("Error seeding albums:", err);
    }
  };
  
  seed();
  
