import express from "express";
import fetch from "node-fetch";
import { promises as fs } from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5001;
const API_KEY = "b60add26";
const JSON_FILE_PATH = path.join(__dirname, "movies.json");

app.use(cors());

app.use(bodyParser.json());

async function getMovieDetails(title) {
  try {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(
      title
    )}&apikey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.Response !== "True") {
      throw new Error(`API Error for ${title}: ${data.Error}`);
    }

    // Map the relevant fields to match the structure of movies.json
    const movie = {
      title: data.Title,
      year: data.Year,
      director: data.Director,
      actors: data.Actors.split(", "),
      rating: 0,
      seen: false,
      genre: data.Genre,
      poster: data.Poster,
    };

    return movie;
  } catch (error) {
    console.error(`Error fetching details for ${title}: ${error.message}`);
    return null;
  }
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get all movies
app.get("/movies", async (req, res) => {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, "utf8");
    const movies = JSON.parse(data);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

// get a movie
app.get("/getMovie/:title", async (req, res) => {
  const title = req.params.title;
  const movieDetails = await getMovieDetails(title);
  if (movieDetails) {
    res.json(movieDetails);
  } else {
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

// add a new movie with duplicate check
app.post("/addMovie", async (req, res) => {
  const newMovie = req.body;

  try {
    // Read the existing movies from the JSON file
    const data = await fs.readFile(JSON_FILE_PATH, "utf8");
    const movies = JSON.parse(data);

    // Check if the movie already exists
    const movieExists = movies.some(
      (movie) => movie.title.toLowerCase() === newMovie.title.toLowerCase()
    );
    if (movieExists) {
      return res.status(409).json({ error: "Movie already exists" });
    }

    // Add the new movie to the array
    movies.push(newMovie);

    // Write the updated array back to the JSON file
    await fs.writeFile(JSON_FILE_PATH, JSON.stringify(movies, null, 2));

    res.status(201).json({ message: "Movie added successfully!" });
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Failed to add movie" });
  }
});

// update the rating and seen values of a movie
app.put("/updateMovie/:title", async (req, res) => {
  const title = req.params.title;
  const { rating, seen } = req.body;

  try {
    // Read the existing movies from the JSON file
    const data = await fs.readFile(JSON_FILE_PATH, "utf8");
    const movies = JSON.parse(data);

    // Find the movie and update its rating and seen values
    const movieIndex = movies.findIndex(
      (movie) => movie.title.toLowerCase() === title.toLowerCase()
    );
    if (movieIndex === -1) {
      return res.status(404).json({ error: "Movie not found" });
    }

    if (rating !== undefined) {
      movies[movieIndex].rating = rating;
    }
    if (seen !== undefined) {
      movies[movieIndex].seen = seen;
    }

    // Write the updated array back to the JSON file
    await fs.writeFile(JSON_FILE_PATH, JSON.stringify(movies, null, 2));

    res.status(200).json({ message: "Movie updated successfully!" });
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ error: "Failed to update movie" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Express app listening at http://localhost:${port}`);
});
