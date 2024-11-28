// import { useNavigate } from "react-router-dom";

export default function MovieCardClickHandler(movie) {
  //   const navigate = useNavigate();

  function handleCardClick() {
    if (currentCategory === "now_playing") {
      navigate(`/movie/${encodeURIComponent(movie.title)}`);
    } else {
      navigate(`/movie-reviews/${encodeURIComponent(movie.title)}`);
    }
  }

  return (
    <div
      className="card h-100"
      style={{ cursor: "pointer" }}
      onClick={handleCardClick}
    >
      {movie.image && (
        <img src={movie.image} className="card-img-top" alt={movie.title} />
      )}
      <div className="card-body">
        <h5 className="card-title">{movie.title}</h5>
        <p>{movie.releaseDate}</p>
      </div>
    </div>
  );
}
