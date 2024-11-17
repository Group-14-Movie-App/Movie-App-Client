import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieCards({ movieList }) {
  return (
    <div className="container">
      <div className="row">
        {movieList.map((movie) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.id}>
            <div className="card h-100" key={movie.id}>
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
