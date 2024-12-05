import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "./MovieCards"; // Import the custom MovieCards component
import "./GroupPostsModal.css"; // Styles for the modal and its content

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

function MyGroupPostsModal({ onClose, onMovieCardClick }) {
    const [moviesList, setMoviesList] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  
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
            startTime: show.getElementsByTagName("dttmShowStart")[0].textContent,
            endTime: show.getElementsByTagName("dttmShowEnd")[0].textContent,
            image: show.getElementsByTagName("EventMediumImagePortrait")[0].textContent,
            theatreAndAuditorium: show.getElementsByTagName("TheatreAndAuditorium")[0].textContent,
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
        movie.title.toLowerCase().includes(term)
      );
      setFilteredMovies(filtered);
    };
  
    return (
      <div className="my-group-posts-modal">
        <div className="modal-content">
          <h2 className="modal-title">Search Movies</h2>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
  
          {/* Location Dropdown */}
          <div className="mb-4">
            <select
              className="form-select"
              value={selectedRegion.id}
              onChange={(e) => {
                const region = regions.find((region) => region.id === parseInt(e.target.value));
                setSelectedRegion(region);
              }}
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
  
          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Movie Name"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
  
          {/* Movie Cards */}
          <div className="movie-cards-container">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="movie-card"
                  onClick={() => onMovieCardClick(movie)}
                >
                  <img src={movie.image} alt={movie.title} />
                  <div className="movie-card-content">
                    <p className="title">{movie.title}</p>
                    <p className="time">
                      <strong>Start:</strong> {new Date(movie.startTime).toLocaleString()}
                    </p>
                    <p className="time">
                      <strong>End:</strong> {new Date(movie.endTime).toLocaleString()}
                    </p>
                    <p className="theater">{movie.theatreAndAuditorium}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No movies found.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default MyGroupPostsModal;
  