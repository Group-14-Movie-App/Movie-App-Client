import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "../components/Showtimes_Components/MovieCards.js";
import "./screensStyles/ShowtimesPage.css";

// Updated list of Theatre Areas
const regions = [
  { id: 1029, name: "Valitse alue/teatteri" },
  { id: 1014, name: "Pääkaupunkiseutu" },
  { id: 1012, name: "Espoo" },
  { id: 1039, name: "Espoo: OMENA" },
  { id: 1038, name: "Espoo: SELLO" },
  { id: 1002, name: "Helsinki" },
  { id: 1045, name: "Helsinki: ITIS" },
  { id: 1031, name: "Helsinki: KINOPALATSI" },
  { id: 1032, name: "Helsinki: MAXIM" },
  { id: 1033, name: "Helsinki: TENNISPALATSI" },
  { id: 1013, name: "Vantaa: FLAMINGO" },
  { id: 1015, name: "Jyväskylä: FANTASIA" },
  { id: 1016, name: "Kuopio: SCALA" },
  { id: 1017, name: "Lahti: KUVAPALATSI" },
  { id: 1041, name: "Lappeenranta: STRAND" },
  { id: 1018, name: "Oulu: PLAZA" },
  { id: 1019, name: "Pori: PROMENADI" },
  { id: 1021, name: "Tampere" },
  { id: 1034, name: "Tampere: CINE ATLAS" },
  { id: 1035, name: "Tampere: PLEVNA" },
  { id: 1047, name: "Turku ja Raisio" },
  { id: 1022, name: "Turku: KINOPALATSI" },
  { id: 1046, name: "Raisio: LUXE MYLLY" },
];

function ShowtimesPage() {
  const [moviesList, setMoviesList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(regions[0]); // Default to "Valitse alue/teatteri"

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://www.finnkino.fi/xml/Schedule/?area=${selectedRegion.id}&dt=${new Date()
            .toISOString()
            .split("T")[0]}`
        );
        const data = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        const shows = Array.from(xml.getElementsByTagName("Show")).map((show) => ({
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
          contentDescriptors: Array.from(show.getElementsByTagName("ContentDescriptor")).map((descriptor) => ({
            name: descriptor.getElementsByTagName("Name")[0].textContent,
            imageURL: descriptor.getElementsByTagName("ImageURL")[0].textContent,
          })),
        }));

        setMoviesList(shows);
        setFilteredMovies(shows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchMovies();
  }, [selectedRegion]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filtered = moviesList.filter((movie) =>
      movie.title.toLowerCase().includes(term) || // Filter by movie name
      movie.originalTitle.toLowerCase().includes(term) // Also filter by original title
    );
    setFilteredMovies(filtered);
  };

  return (
    <div className="showtimes-container">
      <h1 className="showtimes-title">Showtimes by Region</h1>

      {/* Region Tabs */}
      <div className="mb-4">
        <ul className="nav nav-tabs">
          {regions.map((region) => (
            <li className="nav-item" key={region.id}>
              <button
                className={`nav-link ${
                  region.id === selectedRegion.id ? "active" : ""
                }`}
                onClick={() => setSelectedRegion(region)}
              >
                {region.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Movie Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Movie Cards */}
      <div>
        <MovieCards movieList={filteredMovies} />
      </div>
    </div>
  );
}

export default ShowtimesPage;
