import React, { useEffect, useState } from "react";

export default function TmdbFetcher({ setTmdbMovies, setLimitedMovies }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = "fd1da3e9c33f64d6ef2a086b20a562f8";
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const movies = data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          rating: movie.vote_average,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          overview: movie.overview,
          releaseDate: movie.release_date,
        }));
        // setTmdbMovies(movies);
        const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);

        // Limit to 6 movies
        const limitedMovies = sortedMovies.slice(0, 6);

        // Update limitedMovies
        setTmdbMovies(sortedMovies);
        setLimitedMovies(limitedMovies);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching TMDb data: ", error);
        setError(error.message);
        setLoading(false);
      });
  }, [setTmdbMovies, setLimitedMovies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return null;
}
