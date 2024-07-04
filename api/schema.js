import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: String,
  year: String,
  director: String,
  actors: [String],
  rating: Number,
  seen: Boolean,
  genre: String,
  poster: String,
});

export const Movie = mongoose.model('Movie', movieSchema);