import { useEffect, useState } from "react";

export default function TmdbFetcher({
  setTmdbMovies,
  setLimitedMovies,
  category = "popular",
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const genreMap = {
    action: 28,
    comedy: 35,
    horror: 27,
    romance: 10749,
    crime: 80,
  };

  useEffect(() => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;
    // Debug for deploy issue
    console.log("API Key: " + apiKey);
    const url =
      genreMap[category] !== undefined
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_genres=${genreMap[category]}&page=1`
        : `https://api.themoviedb.org/3/movie/${category}?api_key=${apiKey}&language=en-US&page=1`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Debug for deploy issue
        console.log("Fetched data:", data);
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
        // Debug for deploy issue
        console.error("Error fetching TMDb data: ", error);
      });
  }, [category, setTmdbMovies, setLimitedMovies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return null;
}
