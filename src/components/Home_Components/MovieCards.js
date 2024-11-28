import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieCards({
  movieList,
  isTmdbMovies = false,
  navigateTo = "details",
}) {
  const navigate = useNavigate();

  // Navigate to MovieDetailsPage
  const handleCardClick = (movie) => {
    if (navigateTo === "details") {
      const completeMovie = {
        ...movie,
        contentDescriptors: movie.contentDescriptors || [],
        spokenLanguage: movie.spokenLanguage || "",
        subtitleLanguage1: movie.subtitleLanguage1 || "",
        subtitleLanguage2: movie.subtitleLanguage2 || "",
        productionYear: movie.productionYear || "Unknown",
        eventType: movie.eventType || "",
        theatreAndAuditorium: movie.theatreAndAuditorium || "",
        genres: movie.genres || "",
        ratingImageUrl: movie.ratingImageUrl || "",
      };

      if (isTmdbMovies) {
        navigate(`/tmdb-movie-details/${movie.tmdbId}`, {
          state: { movie: completeMovie },
        });
      } else {
        navigate(`/movie-details/${movie.id}`, {
          state: { movie: completeMovie },
        });
      }
    } else if (navigateTo === "reviews") {
      navigate(`/movie-reviews/${movie.title}`);
    }
  };

  return (
    <div className="container">
      <div className="row">
        {movieList.map((movie) => (
          <div
            className="col-lg-2 col-sm-4 mb-4"
            key={movie.id || movie.tmdbId}
          >
            <div
              className="card h-100"
              // Add handleCardClick function
              onClick={() => handleCardClick(movie)}
              style={{ cursor: "pointer" }}
            >
              {/* Move Poster */}
              <img
                src={movie.image}
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                {/* Movie Title */}
                <h3 className="card-title">{movie.title}</h3>
                {/* Movie Rating */}
                <p className="card-text">
                  <strong>Rating:</strong> {movie.rating ? movie.rating : 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCards;
