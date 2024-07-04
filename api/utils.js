import fetch from 'node-fetch';

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export const getOmdbMovieDetails = async (title) => {
  try {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.Response !== 'True') {
      throw new Error(`API Error for ${title}: ${data.Error}`);
    }

    const movie = {
      title: data.Title,
      year: data.Year,
      director: data.Director,
      actors: data.Actors.split(', '),
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