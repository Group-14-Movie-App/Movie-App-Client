import { useEffect, useState } from "react";

export default function TmdbFetcher({ setTmdbMovies }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY; // Fetch API key from .env file

    if (!apiKey) {
      console.error("TMDB API Key is missing in the .env file!");
      setError("API Key is missing");
      setLoading(false);
      return;
    }

    const url =
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${apiKey}`, // Use the fetched API key
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        const movies = data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          original_title: movie.original_title,
          release_date: movie.release_date,
          overview: movie.overview,
          genre_ids: movie.genre_ids,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          poster_path: movie.poster_path,
        }));

        setTmdbMovies(movies); // Only update the main movies list
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching TMDb data: ", error);
        setError(error.message);
        setLoading(false);
      });
  }, [setTmdbMovies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return null;
}
