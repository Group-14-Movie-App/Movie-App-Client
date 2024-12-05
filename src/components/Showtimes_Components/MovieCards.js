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
    <div className="unique-container">
      <div className="row unique-row">
        {movieList.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4 unique-movie-card-container" key={movie.id}>
            <div
              className="unique-movie-card h-100"
              onClick={() => handleCardClick(movie)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={movie.image}
                className="unique-movie-card-img-top"
                alt={movie.title}
              />
              <div className="unique-movie-card-body">
                <h5 className="unique-movie-card-title">{movie.title}</h5>
                <p className="unique-movie-card-text">
                  <strong>Original Title:</strong> {movie.originalTitle}
                </p>
                <p className="unique-movie-card-text">
                  <strong>Start Time:</strong>{' '}
                  {new Date(movie.startTime).toLocaleString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="unique-movie-card-text">
                  <strong>End Time:</strong>{' '}
                  {new Date(movie.endTime).toLocaleString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="unique-movie-card-text">
                  <strong>Genres:</strong> {movie.genres}
                </p>
                <p className="unique-movie-card-footer">
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
