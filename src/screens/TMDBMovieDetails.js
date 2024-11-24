import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function TMDBMovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [rating, setRating] = useState(0); // To hold the selected rating
  const [comment, setComment] = useState(''); // To hold the user's comment
  const [feedback, setFeedback] = useState(''); // To give feedback after submission
  const [isFinnkinoAvailable, setIsFinnkinoAvailable] = useState(false); // Check Finnkino availability
  const [finnkinoMovie, setFinnkinoMovie] = useState(null); // Finnkino movie details

  useEffect(() => {
    const checkFinnkinoAPI = async () => {
      try {
        const response = await fetch('https://www.finnkino.fi/xml/Schedule/');
        const textData = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, 'application/xml');
        const shows = Array.from(xml.getElementsByTagName('Show')).map((show) => ({
          title: show.getElementsByTagName('Title')[0]?.textContent,
          originalTitle: show.getElementsByTagName('OriginalTitle')[0]?.textContent,
          productionYear: show.getElementsByTagName('ProductionYear')[0]?.textContent,
          startTime: show.getElementsByTagName('dttmShowStart')[0]?.textContent,
          endTime: show.getElementsByTagName('dttmShowEnd')[0]?.textContent,
          genres: show.getElementsByTagName('Genres')[0]?.textContent,
          theatreAndAuditorium: show.getElementsByTagName('TheatreAndAuditorium')[0]?.textContent,
          image: show.getElementsByTagName('EventMediumImagePortrait')[0]?.textContent,
          ratingImageUrl: show.getElementsByTagName('RatingImageUrl')[0]?.textContent,
        }));

        const match = shows.find(
          (show) =>
            (show.title.toLowerCase() === movie.title.toLowerCase() ||
              show.originalTitle.toLowerCase() === movie.original_title.toLowerCase()) &&
            show.productionYear === movie.release_date.split('-')[0]
        );

        if (match) {
          setIsFinnkinoAvailable(true);
          setFinnkinoMovie(match);
        }
      } catch (error) {
        console.error('Error fetching Finnkino API:', error);
      }
    };

    if (movie) {
      checkFinnkinoAPI();
    }
  }, [movie]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        setFeedback('Please log in to submit a review.');
        return;
    }

    if (!rating || !comment.trim()) {
        setFeedback('Please provide both a rating and a comment.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: user.userid,
                movieTitle: movie.original_title, // Use the original title here
                releaseDate: movie.release_date,
                description: comment,
                rating,
            }),
        });

        if (response.ok) {
            setFeedback('Thank you for your review!');
            setRating(0);
            setComment('');
        } else {
            const errorData = await response.json();
            if (errorData.message.includes('already reviewed')) {
                alert(`You have already reviewed the movie "${movie.original_title}".`);
            } else {
                setFeedback('Failed to submit review. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        setFeedback('An error occurred. Please try again.');
    }
};


  if (!movie) {
    return <div>Movie details not found.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="img-fluid mb-4"
      />
      <p><strong>Original Title:</strong> {movie.original_title}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Genres:</strong> {movie.genre_ids.join(', ')}</p>
      <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
      <p><strong>Vote Count:</strong> {movie.vote_count}</p>

      {isFinnkinoAvailable && (
        <button
          className="btn btn-primary mt-4"
          onClick={() =>
            navigate('/tmdb-to-finnkino-details', { state: { finnkinoMovie } })
          }
        >
          View Finnkino Details
        </button>
      )}

      {/* Add Review Section */}
      <div className="review-section mt-5">
        <h3>Rate this Movie</h3>
        <div className="rating-stars mb-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              className={`star ${value <= rating ? 'selected' : ''}`}
              style={{
                fontSize: '2rem',
                color: value <= rating ? 'gold' : 'gray',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleSubmitReview}>
          Submit Review
        </button>

        {feedback && <p className="mt-3 text-success">{feedback}</p>}
      </div>
    </div>
  );
}

export default TMDBMovieDetails;
