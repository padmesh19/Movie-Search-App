import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Home() {
  const { name, type, page } = useParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem("lastSearchQuery") || name || ""
  );
  const [genre, setGenre] = useState(
    localStorage.getItem("lastGenre") || type || ""
  );
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [pageNum, setPageNum] = useState(
    localStorage.getItem("lastPageNum") || page || 1
  );
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (searchQuery && genre) {
      fetchMoviesWithType();
    } else if (searchQuery) {
      fetchMovies();
    }
  }, [searchQuery, genre, pageNum]);

  useEffect(() => {
    // Save search state to localStorage when it changes
    localStorage.setItem("lastSearchQuery", searchQuery);
    localStorage.setItem("lastGenre", genre);
    localStorage.setItem("lastPageNum", pageNum);
  }, [searchQuery, genre, pageNum]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchQuery}&page=${pageNum}&apikey=1ec5391a`
      );
      if (response.data.Response === "True") {
        navigate(`/${searchQuery}/${pageNum}`);
        setMovies(response.data.Search);
        setTotalResults(Number(response.data.totalResults));
        setError(null);
      } else {
        setError(response.data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
    }
  };

  const fetchMoviesWithType = async () => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchQuery}&type=${genre}&page=${pageNum}&apikey=1ec5391a`
      );
      if (response.data.Response === "True") {
        navigate(`/${searchQuery}/${genre}/${pageNum}`);
        setMovies(response.data.Search);
        setTotalResults(Number(response.data.totalResults));
        setError(null);
      } else {
        setError(response.data.Error);
        setMovies([]);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNum(1);
    fetchMovies();
  };

  const handleSelect = (e) => {
    e.preventDefault();
    setPageNum(1);
    setGenre(e.target.value);
    fetchMoviesWithType();
  };

  const handlePageChange = (direction) => {
    const newPage = Number(pageNum) + direction;
    if (newPage > 0 && newPage <= Math.ceil(totalResults / 10)) {
      setPageNum(newPage);
    }
  };

  return (
    <div className="home px-4 lg:px-8 py-4 bg-gray-700 flex flex-col items-center gap-4 min-h-screen max-h-screen">
      <div className="bg-cyan-800 py-4 rounded w-full flex flex-col items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            localStorage.removeItem("lastSearchQuery");
            localStorage.removeItem("lastGenre");
            localStorage.removeItem("lastPageNum");
            setSearchQuery("");
            setGenre("");
            setPageNum(1);
            setMovies([]);
            setError(null);
          }}
        >
          <img src="/video-player.png" className="h-8" />
          <h1 className="text-center text-2xl text-white font-bold">
            Movie Search
          </h1>
        </Link>
        <form
          onSubmit={handleSearch}
          className="flex justify-center gap-2 w-10/12 md:w-2/3"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies..."
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-fit"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <p className="text-center text-2xl flex justify-center items-center mt-10 font-semibold text-red-600">
          {error}
        </p>
      )}

      {movies.length === 0 && !error && (
        <div className="text-center text-2xl flex justify-center items-center min-h-[70vh] font-semibold text-white">
          - Search Your Movie Please -
        </div>
      )}

      {movies.length > 0 && (
        <div className="w-full sticky top-4 flex justify-between gap-4">
          <select
            name="movie-type"
            id="movie-type"
            className="bg-gray-300 hover:bg-gray-500 p-2 w-fit rounded"
            onChange={handleSelect}
            value={genre}
          >
            <option value="">-select-</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
          <div className="flex gap-4">
            <button
              onClick={() => handlePageChange(-1)}
              disabled={pageNum == 1}
              className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(1)}
              disabled={pageNum == Math.ceil(totalResults / 10)}
              className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="overflow-y-scroll pr-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="border p-2 rounded bg-slate-200">
            <Link to={`/movie/${movie.imdbID}`}>
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-48 object-contain"
              />
              <h2 className="text-lg font-bold mt-2">{movie.Title}</h2>
              <p>{movie.Year}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
