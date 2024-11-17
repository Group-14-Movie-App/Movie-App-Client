import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "../components/Home_Components/MovieCards.js";
import styles from "./screensStyles/HomePage.module.css";

function HomePage() {
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    fetch("https://www.finnkino.fi/xml/Schedule/")
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        const shows = Array.from(xml.getElementsByTagName("Show")).map(
          (show) => ({
            id: show.getElementsByTagName("ID")[0].textContent,
            title: show.getElementsByTagName("Title")[0].textContent,
            rating: parseInt(
              show.getElementsByTagName("Rating")[0]?.textContent || 0
            ),
            image: show.getElementsByTagName("EventMediumImagePortrait")[0]
              .textContent,
          })
        );
        //Sort by Rating in descending order
        shows.sort((a, b) => b.rating - a.rating);

        setMoviesList(shows);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <div>
        <input type="text" placeholder="Find Your Favorite" />
        <button>Search</button>
      </div>
      <p className={styles.title}>Top Movies</p>
      <div>
        <MovieCards movieList={moviesList} />
      </div>
    </div>
  );
}

export default HomePage;
