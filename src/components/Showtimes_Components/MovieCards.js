import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieCards.css';

function MovieCards({ movieList }) {
  const navigate = useNavigate();

  const handleCardClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="container movie-cards-container">
      <div className="row">
        {movieList.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.id}>
            <div
              className="movie-card h-100"
              onClick={() => handleCardClick(movie)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={movie.image}
                className="movie-card-img-top"
                alt={movie.title}
              />
              <div className="movie-card-body">
                <h5 className="movie-card-title">{movie.title}</h5>
                <p className="movie-card-text">
                  <strong>Original Title:</strong> {movie.originalTitle}
                </p>
                <p className="movie-card-text">
                  <strong>Start Time:</strong>{' '}
                  {new Date(movie.startTime).toLocaleString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="movie-card-text">
                  <strong>End Time:</strong>{' '}
                  {new Date(movie.endTime).toLocaleString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="movie-card-text">
                  <strong>Genres:</strong> {movie.genres}
                </p>
                <p className="movie-card-footer">
                  Theatre: {movie.theatreAndAuditorium}
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
