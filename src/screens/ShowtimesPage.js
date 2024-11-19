import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieCards from '../components/Showtimes_Components/MovieCards.js';
import './screensStyles/ShowtimesPage.css'

function ShowtimesPage() {
  const [moviesList, setMoviesList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]); // State to hold filtered movies
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input

  useEffect(() => {
    fetch('https://www.finnkino.fi/xml/Schedule/')
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        const shows = Array.from(xml.getElementsByTagName("Show")).map(show => ({
          id: show.getElementsByTagName("ID")[0].textContent,
          title: show.getElementsByTagName("Title")[0].textContent,
          originalTitle: show.getElementsByTagName("OriginalTitle")[0].textContent,
          startTime: show.getElementsByTagName("dttmShowStart")[0].textContent,
          endTime: show.getElementsByTagName("dttmShowEnd")[0].textContent,
          genres: show.getElementsByTagName("Genres")[0].textContent,
          ratingImageUrl: show.getElementsByTagName("RatingImageUrl")[0].textContent,
          theatreAndAuditorium: show.getElementsByTagName("TheatreAndAuditorium")[0].textContent,
          image: show.getElementsByTagName("EventMediumImagePortrait")[0].textContent,
          productionYear: show.getElementsByTagName("ProductionYear")[0]?.textContent || "",
          eventType: show.getElementsByTagName("EventType")[0]?.textContent || "",
          theatre: show.getElementsByTagName("Theatre")[0]?.textContent || "",
          theatreAuditorium: show.getElementsByTagName("TheatreAuditorium")[0]?.textContent || "",
          presentationMethodAndLanguage: show.getElementsByTagName("PresentationMethodAndLanguage")[0]?.textContent || "",
          spokenLanguage: show.getElementsByTagName("SpokenLanguage")[0]?.getElementsByTagName("Name")[0]?.textContent || "",
          subtitleLanguage1: show.getElementsByTagName("SubtitleLanguage1")[0]?.getElementsByTagName("Name")[0]?.textContent || "",
          subtitleLanguage2: show.getElementsByTagName("SubtitleLanguage2")[0]?.getElementsByTagName("Name")[0]?.textContent || "",
          contentDescriptors: Array.from(show.getElementsByTagName("ContentDescriptor")).map(descriptor => ({
            name: descriptor.getElementsByTagName("Name")[0].textContent,
            imageURL: descriptor.getElementsByTagName("ImageURL")[0].textContent
          }))
        }));

        setMoviesList(shows);
        setFilteredMovies(shows); // Initialize filtered movies with all movies
        console.log(shows)
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  // Function to handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Filter movies based on the theater name containing the search term
    const filtered = moviesList.filter(movie =>
      movie.theatre.toLowerCase().includes(term)
    );
    setFilteredMovies(filtered);
  };

  return (
    <div className="showtimes-container">
      <h1 className="showtimes-title">Showtimes</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Theatre (e.g., Helsinki)"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div>
        <MovieCards movieList={filteredMovies} />
      </div>
    </div>
  );
}

export default ShowtimesPage;
