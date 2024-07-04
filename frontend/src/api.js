import axios from "axios";

// const PORT = 5001;
// const URL = `http://localhost:${PORT}`;
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
// const ENDPOINT = REACT_APP_API_URL || URL
const ENDPOINT = 'https://movies-api-3wed.onrender.com';

export const getMovies = async () => {
  try {
    const response = await axios.get(`${ENDPOINT}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const getMovie = async (title) => {
  try {
    const response = await axios.get(`${ENDPOINT}/getMovie/${title}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const addMovie = async (movie) => {
  try {
    const response = await axios.post(`${ENDPOINT}/addMovie`, movie);
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const updateMovie = async (title, updates) => {
  try {
    const response = await axios.put(`${ENDPOINT}/updateMovie/${title}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};
