import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MovieDetails()
{
    const {id} = useParams();
    const [movie, setMovie] = useState("");

    useEffect(()=>
    {
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, 
            {
                method: 'GET',
                headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_MOVIE_DETAILS_API_KEY}`
                }
            })

          .then((response) => response.json())

          .then((response) => {
            console.log("Movie Details: ", response)
            
            setMovie(response);
          })

    } , [id])

    if (!movie) return <p>Loading...</p>; // Render a loading message until `movie` is defined

    return(
        <div style={{ padding: '20px' }}>
            <h1>{movie.title} ({movie.release_date?.slice(0, 4)})</h1>
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                style={{ width: '300px', marginBottom: '20px' }}
            />
            <p><strong>Tagline:</strong> {movie.tagline}</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Status:</strong> {movie.status}</p>
            <p><strong>Budget:</strong> ${movie.budget.toLocaleString() || 'N/A'}</p>
            <p><strong>Revenue:</strong> ${movie.revenue.toLocaleString() || 'N/A'}</p>
            <p><strong>Vote Average:</strong> {movie.vote_average} / 10</p>
            <p><strong>Vote Count:</strong> {movie.vote_count}</p>
            <p><strong>Original Language:</strong> {movie.original_language.toUpperCase()}</p>
            <p><strong>Production Companies:</strong> {movie.production_companies?.map((company) => company.name).join(', ')}</p>
            <p><strong>Homepage:</strong> <a href={movie.homepage} target="_blank" rel="noopener noreferrer">{movie.homepage}</a></p>
        </div>
    )
}


export default MovieDetails;