import React from "react";
import "./MovieCards.css"; // Styling for movie cards

// Assuming you have a movie object that includes these fields
function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.image} alt={movie.title} />
      <div className="movie-card-content">
        <p className="title">{movie.title}</p>
        <p className="time">
          <strong>Start:</strong>{" "}
          {new Date(movie.startTime).toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="time">
          <strong>End:</strong>{" "}
          {new Date(movie.endTime).toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="theater">{movie.theatreAndAuditorium}</p>
      </div>
    </div>
  );
}

function MovieCards({ movieList }) {
  return (
    <div className="movie-cards-container">
      {movieList.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieCards;
