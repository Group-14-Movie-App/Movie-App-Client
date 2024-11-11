import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieCards from '../components/Homepage_Components/MovieCards.js';

function HomePage() 
{
  const [moviesList, setMoviesList] = useState([]);

  useEffect(()=>
    {
      fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
        {
          method: 'GET',
          headers :
          {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`
          }
        }
      )

      .then((response) =>
      {
        return response.json();
      })

      .then((response)=>
      {
        console.log(response.results);

        setMoviesList(response.results);

      })
    },[])

  return (
    <div>

      <h1>Popular Movies</h1>
      <div>
        <MovieCards movieList={moviesList} />
      </div>
      
      
    </div>
  );
}

export default HomePage;