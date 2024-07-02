import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Checkbox,
  Avatar,
  TextField,
  StyledEngineProvider,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  Slide,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { getMovies, updateMovie, getMovie, addMovie } from "./api";
import "./App.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [editingRating, setEditingRating] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const moviesJson = await getMovies();
      setMovies(moviesJson);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
    const sorted = [...movies].sort((a, b) => {
      if (a[property] < b[property]) return -1 * (isAsc ? 1 : -1);
      if (a[property] > b[property]) return 1 * (isAsc ? 1 : -1);
      return 0;
    });
    setMovies(sorted);
  };

  const openGoogleSearch = (content) => {
    const searchQuery = encodeURIComponent(content);
    window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
  };

  const renderLink = (content) => (
    <span className="link" onClick={() => openGoogleSearch(content)}>
      {content}
    </span>
  );

  const handleCheckboxChange = async (title, seen) => {
    try {
      await updateMovie(title, { seen: !seen });
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.title === title ? { ...movie, seen: !seen } : movie
        )
      );
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleRatingChange = (event, title) => {
    const newRating = event.target.value;
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.title === title ? { ...movie, rating: newRating } : movie
      )
    );
  };

  const handleRatingKeyPress = async (event, title, rating) => {
    if (event.key === "Enter") {
      await saveRating(title, rating);
    }
  };

  const handleRatingBlur = async (title, rating) => {
    await saveRating(title, rating);
  };

  const saveRating = async (title, rating) => {
    try {
      await updateMovie(title, { rating: parseFloat(rating) });
      setEditingRating(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating movie rating:", error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const clearFilter = () => {
    setFilter("");
  };

  const handlePosterClick = (poster) => {
    setSelectedPoster(poster);
  };

  const handleCloseDialog = () => {
    setSelectedPoster(null);
  };

  const handleAddDialogOpen = () => {
    setIsAddDialogOpen(true);
    setSearchTitle("");
    setSearchResult(null);
  };

  const handleAddDialogClose = () => {
    setIsAddDialogOpen(false);
  };

  const handleSearchTitleChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const handleSearchMovie = async () => {
    setIsLoading(true);
    try {
      const result = await getMovie(searchTitle);
      setSearchResult(result);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
    setIsLoading(false);
  };

  const handleAddMovie = async () => {
    if (searchResult) {
      try {
        await addMovie(searchResult);
        await loadMovies();
        handleAddDialogClose();
      } catch (error) {
        console.error("Error adding movie:", error);
      }
    }
  };

  const toggleRow = (title) => {
    setOpen((prevOpen) => ({ ...prevOpen, [title]: !prevOpen[title] }));
  };

  const filteredMovies = movies.filter((movie) => {
    return Object.values(movie).some((value) => {
      if (typeof value === "boolean") {
        // Handle "seen" and "not seen" filtering
        if (filter === "seen" && value) return true;
        if (filter === "not seen" && !value) return true;
      }
      return value.toString().toLowerCase().includes(filter);
    });
  });

  return (
    <StyledEngineProvider injectFirst>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={10} sm={6} md={4}>
          <TextField
            label="Search..."
            variant="outlined"
            margin="normal"
            fullWidth
            value={filter}
            onChange={handleFilterChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={clearFilter} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={2} sm={2} md={2} display="flex" alignItems="center">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddDialogOpen}
            sx={{ bgcolor: "var(--primary-color)", color: "white" }}
          >
            {!isMobile && "Add"}
          </Button>
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography variant="h6">
            {filteredMovies.length}{" "}
            {filteredMovies.length === 1 ? "movie" : "movies"}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper className="main-table-paper" sx={{ overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "calc(100vh - 190px)" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {isMobile && <TableCell />}
                    {!isMobile && <TableCell />}
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === "title"}
                        direction={sortDirection}
                        onClick={() => handleSort("title")}
                      >
                        Title
                      </TableSortLabel>
                    </TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>
                          <TableSortLabel
                            active={sortBy === "year"}
                            direction={sortDirection}
                            onClick={() => handleSort("year")}
                          >
                            Year
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortBy === "director"}
                            direction={sortDirection}
                            onClick={() => handleSort("director")}
                          >
                            Director
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortBy === "genre"}
                            direction={sortDirection}
                            onClick={() => handleSort("genre")}
                          >
                            Genre
                          </TableSortLabel>
                        </TableCell>
                        <TableCell>
                          <TableSortLabel
                            active={sortBy === "actors"}
                            direction={sortDirection}
                            onClick={() => handleSort("actors")}
                          >
                            Actors
                          </TableSortLabel>
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === "rating"}
                        direction={sortDirection}
                        onClick={() => handleSort("rating")}
                      >
                        Rating
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === "seen"}
                        direction={sortDirection}
                        onClick={() => handleSort("seen")}
                      >
                        Seen
                      </TableSortLabel>
                    </TableCell>
                    {isMobile && <TableCell />}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMovies.map((movie, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        {isMobile && (
                          <TableCell>
                            <IconButton onClick={() => toggleRow(movie.title)}>
                              {open[movie.title] ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell className="poster">
                            <Avatar
                              alt="Movie Poster"
                              src={movie.poster}
                              variant="rounded"
                              onClick={() => handlePosterClick(movie.poster)}
                              style={{ cursor: "pointer" }}
                              sx={{ width: 100, height: 100 }}
                            />
                          </TableCell>
                        )}
                        <TableCell>{renderLink(movie.title)}</TableCell>
                        {!isMobile && <TableCell>{movie.year}</TableCell>}
                        {!isMobile && (
                          <TableCell>{renderLink(movie.director)}</TableCell>
                        )}
                        {!isMobile && <TableCell>{movie.genre}</TableCell>}
                        {!isMobile && (
                          <TableCell>
                            {movie.actors.map((actor, index) => (
                              <React.Fragment key={index}>
                                {renderLink(actor)}
                                {index < movie.actors.length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </TableCell>
                        )}
                        <TableCell>
                          {editingRating === movie.title ? (
                            <TextField
                              value={movie.rating}
                              onChange={(e) =>
                                handleRatingChange(e, movie.title)
                              }
                              onKeyPress={(e) =>
                                handleRatingKeyPress(
                                  e,
                                  movie.title,
                                  movie.rating
                                )
                              }
                              onBlur={() =>
                                handleRatingBlur(movie.title, movie.rating)
                              }
                              autoFocus
                              sx={{ width: "50px" }}
                            />
                          ) : (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <span>{movie.rating}</span>
                              <IconButton
                                onClick={() => setEditingRating(movie.title)}
                                size="small"
                                sx={{ marginLeft: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={movie.seen}
                            onChange={() =>
                              handleCheckboxChange(movie.title, movie.seen)
                            }
                          />
                        </TableCell>
                      </TableRow>
                      {isMobile && (
                        <TableRow>
                          <TableCell
                            style={{ paddingBottom: 0, paddingTop: 0 }}
                            colSpan={6}
                          >
                            <Collapse
                              in={open[movie.title]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box
                                margin={1}
                                display="flex"
                                alignItems="center"
                              >
                                <Avatar
                                  alt="Movie Poster"
                                  src={movie.poster}
                                  variant="rounded"
                                  onClick={() =>
                                    handlePosterClick(movie.poster)
                                  }
                                  sx={{
                                    width: 150,
                                    height: 200,
                                    marginRight: 2,
                                  }}
                                />
                                <Box>
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    Year:
                                  </Typography>
                                  {movie.year}
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    Director:
                                  </Typography>
                                  {renderLink(movie.director)}
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    Genre:
                                  </Typography>
                                  {movie.genre}
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    Actors:
                                  </Typography>
                                  {movie.actors.map((actor, index) => (
                                    <React.Fragment key={index}>
                                      {renderLink(actor)}
                                      {index < movie.actors.length - 1 && ", "}
                                    </React.Fragment>
                                  ))}
                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={isAddDialogOpen}
        onClose={handleAddDialogClose}
        fullScreen
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", bgcolor: "var(--primary-color)" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleAddDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Movie
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            label="Movie Title"
            variant="outlined"
            margin="normal"
            fullWidth
            value={searchTitle}
            onChange={handleSearchTitleChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchMovie}
            disabled={isLoading}
            sx={{ mt: 2, bgcolor: "var(--primary-color)" }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Search"}
          </Button>
          {searchResult && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <Avatar
                alt="Movie Poster"
                src={searchResult.poster}
                variant="rounded"
                sx={{ width: 200, height: 300, marginBottom: 2 }}
              />
              <Typography variant="h4">{searchResult.title}</Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {searchResult.year}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                Directed by: {renderLink(searchResult.director)}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                Genre: {searchResult.genre}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                Actors: {searchResult.actors.join(", ")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddMovie}
            color="primary"
            variant="contained"
            disabled={!searchResult}
            sx={{ bgcolor: "var(--primary-color)" }}
          >
            Add
          </Button>
          <Button
            onClick={handleAddDialogClose}
            color="secondary"
            sx={{ color: "var(--primary-color)" }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selectedPoster} onClose={handleCloseDialog}>
        <DialogContent>
          <img
            src={selectedPoster}
            alt="Selected Movie Poster"
            style={{ width: "100%", height: "auto" }}
          />
        </DialogContent>
      </Dialog>
    </StyledEngineProvider>
  );
}

export default App;
