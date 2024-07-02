import axios from "axios";

const PORT = 5001;
const URL = `http://localhost:${PORT}`;

export const getMovies = async () => {
  try {
    const response = await axios.get(`${URL}/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const getMovie = async (title) => {
  try {
    const response = await axios.get(`${URL}/getMovie/${title}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const addMovie = async (movie) => {
  try {
    const response = await axios.post(`${URL}/addMovie`, movie);
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const updateMovie = async (title, updates) => {
  try {
    const response = await axios.put(`${URL}/updateMovie/${title}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    throw error;
  }
};
