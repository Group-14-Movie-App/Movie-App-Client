import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MovieCards.css'

function MovieCards({ movieList }) {
  const navigate = useNavigate();

  const handleCardClick = (movie) => {
    // We can navigate to MovieDetailsPage with the movie ID
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="container">
      <div className="row">
        {movieList.map(movie => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.id}>
            <div className="card h-100" onClick={() => handleCardClick(movie)} style={{ cursor: 'pointer' }}>
              <img src={movie.image} className="card-img-top" alt={movie.title} />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text"><strong>Original Title:</strong> {movie.originalTitle}</p>
                <p className="card-text"><strong>Start Time:</strong> {movie.startTime}</p>
                <p className="card-text"><strong>End Time:</strong> {movie.endTime}</p>
                <p className="card-text"><strong>Genres:</strong> {movie.genres}</p>
                <p className="card-text"><strong>Theatre:</strong> {movie.theatreAndAuditorium}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCards;
