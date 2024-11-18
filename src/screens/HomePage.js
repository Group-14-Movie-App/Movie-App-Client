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
            originalTitle:
              show.getElementsByTagName("OriginalTitle")[0].textContent,
            startTime:
              show.getElementsByTagName("dttmShowStart")[0].textContent,
            endTime: show.getElementsByTagName("dttmShowEnd")[0].textContent,
            genres: show.getElementsByTagName("Genres")[0]?.textContent || "",
            // Add validation to ensure rating is a number
            rating: isNaN(
              parseInt(show.getElementsByTagName("Rating")[0]?.textContent, 10)
            )
              ? 0 // If NaN, default to 0
              : parseInt(
                  show.getElementsByTagName("Rating")[0]?.textContent,
                  10
                ),
            ratingImageUrl:
              show.getElementsByTagName("RatingImageUrl")[0].textContent || 0,
            theatreAndAuditorium:
              show.getElementsByTagName("TheatreAndAuditorium")[0]
                ?.textContent || "",
            image:
              show.getElementsByTagName("EventMediumImagePortrait")[0]
                ?.textContent || "",
            productionYear:
              show.getElementsByTagName("ProductionYear")[0]?.textContent ||
              "Unknown",
            eventType:
              show.getElementsByTagName("EventType")[0]?.textContent || "",
            spokenLanguage:
              show
                .getElementsByTagName("SpokenLanguage")[0]
                ?.getElementsByTagName("Name")[0]?.textContent || "",
            subtitleLanguage1:
              show
                .getElementsByTagName("SubtitleLanguage1")[0]
                ?.getElementsByTagName("Name")[0]?.textContent || "",
            subtitleLanguage2:
              show
                .getElementsByTagName("SubtitleLanguage2")[0]
                ?.getElementsByTagName("Name")[0]?.textContent || "",
            contentDescriptors: Array.from(
              show.getElementsByTagName("ContentDescriptor")
            ).map((descriptor) => ({
              name: descriptor.getElementsByTagName("Name")[0]?.textContent,
              imageURL:
                descriptor.getElementsByTagName("ImageURL")[0]?.textContent,
            })),
          })
        );
        console.log(shows.map((movie) => movie.rating));
        //Sort by Rating in descending order
        const sortedMovies = [...shows].sort((a, b) => b.rating - a.rating);
        console.log(sortedMovies);
        setMoviesList(sortedMovies);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <div className="input-group input-group-sm mb-3">
        <input
          className="form-control"
          aria-label="Search"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          placeholder="Find Your Favorite"
        />
        <div class="input-group-prepend">
          <button class="input-group-text" id="inputGroup-sizing-sm">
            Search
          </button>
        </div>
      </div>
      <p className={styles.title}>Top Movies</p>
      <div>
        <MovieCards movieList={moviesList} />
      </div>
    </div>
  );
}

export default HomePage;
