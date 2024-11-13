import React from 'react';
import { useLocation } from 'react-router-dom';

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie;

  if (!movie) {
    return <div>Movie details not found.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>{movie.title}</h1>
      <img src={movie.image} alt={movie.title} className="img-fluid mb-4" />
      
      <p><strong>Original Title:</strong> {movie.originalTitle}</p>
      <p><strong>Production Year:</strong> {movie.productionYear}</p>
      <p><strong>Event Type:</strong> {movie.eventType}</p>
      <p><strong>Start Time:</strong> {movie.startTime}</p>
      <p><strong>End Time:</strong> {movie.endTime}</p>
      <p><strong>Genres:</strong> {movie.genres}</p>
      <p><strong>Rating:</strong> <img src={movie.ratingImageUrl} alt="Rating" /></p>
      <p><strong>Theatre and Auditorium:</strong> {movie.theatreAndAuditorium}</p>
      <p><strong>Presentation Method and Language:</strong> {movie.presentationMethodAndLanguage}</p>
      <p><strong>Spoken Language:</strong> {movie.spokenLanguage}</p>
      <p><strong>Subtitles:</strong> {movie.subtitleLanguage1}, {movie.subtitleLanguage2}</p>

      {/* Display content descriptors if available */}
      {movie.contentDescriptors.length > 0 && (
        <div>
          <strong>Content Descriptors:</strong>
          <ul>
            {movie.contentDescriptors.map((descriptor, index) => (
              <li key={index}>
                <img src={descriptor.imageURL} alt={descriptor.name} className="mr-2" style={{ width: "20px" }} />
                {descriptor.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MovieDetailsPage;
