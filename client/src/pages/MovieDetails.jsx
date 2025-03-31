import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?i=${id}&apikey=1ec5391a`
        );
        if (response.data.Response === "True") {
          setMovie(response.data);
          setError(null);
        } else {
          setError(response.data.Error);
        }
      } catch (err) {
        setError("Failed to fetch movie details. Please try again later.");
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBack = () => {
    const lastSearchQuery = localStorage.getItem("lastSearchQuery") || "";
    const lastGenre = localStorage.getItem("lastGenre") || "";
    const lastPageNum = localStorage.getItem("lastPageNum") || "1";

    if (lastSearchQuery && lastGenre) {
      navigate(`/${lastSearchQuery}/${lastGenre}/${lastPageNum}`);
    } else if (lastSearchQuery) {
      navigate(`/${lastSearchQuery}/${lastPageNum}`);
    } else {
      navigate("/");
    }
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!movie) {
    return (
      <div className="h-[100vh] bg-gray-800 flex flex-col justify-center items-center gap-4">
        <Loader />
        <h2 className="text-2xl text-white font-semibold">Processing...</h2>
      </div>
    );
  }

  return (
    <div className="movie-details px-8 pb-4 pt-8 bg-gray-700 min-h-screen h-full">
      <button
        onClick={handleBack}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded font-semibold"
      >
        &larr; Back to Search
      </button>

      <div className="flex flex-col gap-4 sm:flex-row mt-10">
        <div className="w-full sm:w-2/5 lg:w-1/4 rounded p-4 bg-gray-400 h-fit min-h-full">
          <img src={movie.Poster} alt={movie.Title} className="w-full" />
        </div>

        <div className="bg-slate-800 min-h-full px-4 rounded shadow-lg sm:w-3/5 lg:w-3/4 flex flex-col justify-start gap-4 py-12">
          <h1 className="text-3xl font-bold text-white mb-4 text-center">
            {movie.Title}
          </h1>
          <p className="text-lg text-gray-300">
            <strong className="text-gray-100 text-xl">Year :</strong>{" "}
            {movie.Year}
          </p>
          <p className="text-lg text-gray-300">
            <strong className="text-gray-100 text-xl">Genre :</strong>{" "}
            {movie.Genre}
          </p>
          <p className="text-lg text-gray-300">
            <strong className="text-gray-100 text-xl">Plot :</strong>{" "}
            {movie.Plot}
          </p>
          <p className="text-lg text-gray-300">
            <strong className="text-gray-100 text-xl">Cast :</strong>{" "}
            {movie.Actors}
          </p>
          <p className="text-lg text-gray-300">
            <strong className="text-gray-100 text-xl">Ratings :</strong>{" "}
            {movie.imdbRating}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
