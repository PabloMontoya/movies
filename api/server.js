import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { Movie } from './schema.js';
import { getOmdbMovieDetails } from './utils.js';
import 'dotenv/config';

const app = express();
const port = 5001;

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(mongoUri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (e) {
    console.log('error:', e);
  }
}
connect().catch(console.dir);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// Get a movie
app.get('/getMovie/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const movieDetails = await getOmdbMovieDetails(title);
    if (movieDetails) {
      res.json(movieDetails);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Add a new movie with duplicate check
app.post('/addMovie', async (req, res) => {
  const newMovie = req.body;

  try {
    // Check if the movie already exists
    const movieExists = await Movie.findOne({ title: new RegExp(newMovie.title, 'i') });
    if (movieExists) {
      return res.status(409).json({ error: 'Movie already exists' });
    }

    // Add the new movie to the database
    const movie = new Movie(newMovie);
    await movie.save();

    res.status(201).json({ message: 'Movie added successfully!' });
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update the rating and seen values of a movie
app.put('/updateMovie/:title', async (req, res) => {
  const title = req.params.title;
  const { rating, seen } = req.body;

  try {
    const movie = await Movie.findOne({ title: new RegExp(title, 'i') });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    if (rating !== undefined) {
      movie.rating = rating;
    }
    if (seen !== undefined) {
      movie.seen = seen;
    }

    await movie.save();
    res.status(200).json({ message: 'Movie updated successfully!' });
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Express app listening at http://localhost:${port}`);
});
