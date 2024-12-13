import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faClock,
  faUser,
  faUsers,
  faStar,
  faHeart,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

// Screen Components
import HomePage from "./screens/HomePage.js";
import ProfilePage from "./screens/ProfilePage.js";
import MovieDetailsPage from "./screens/MovieDetailsPage.js";
import ShowtimesPage from "./screens/ShowtimesPage.js";
import SearchPage from "./screens/SearchPage.js";
import ReviewsPage from "./screens/ReviewsPage.js";
import SignInPage from "./screens/SignInPage.js";
import RegisterPage from "./screens/RegisterPage.js";
import MovieReviewsPage from "./screens/MovieReviewsPage.js";
import TMDBMovieDetails from "./screens/TMDBMovieDetails.js";
import TMDBtoFinkkinoMovieDetails from "./screens/TMDBtoFinkkinoMovieDetails.js";
import UserFavourites from "./screens/UserFavourites.js";

// Groups Components
import GroupsPage from "./screens/GroupsMainPage.js";
import MyGroupDetails from "./components/Groups_Components/MyGroupDetails.js";
import OtherGroupDetails from "./components/Groups_Components/OtherGroupDetails.js";
import MyGroupPosts from "./components/Groups_Components/MyGroupPosts.js";
import OtherGroupPosts from "./components/Groups_Components/OtherGroupPosts.js";

// Favourites Components
import FavoriteGroupDetails from "./components/Profile_Components/FavoriteGroupDetails.js";

// Chatbot Component
import ChatBot from "./screens/ChatBot.js";

// Import the logo
import "./App.css";
import FinnFlixLogo from "./assests/FinFlixLogo3.jpg"; // Adjust the path if necessary

function App() {
  const location = useLocation();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/home-page"; // Redirect to home page
  };


  // Function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="d-flex">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        {/* App Logo */}
        <div className="sidebar-logo">
          <Link to="/home-page">
            <img src={FinnFlixLogo} alt="FinnFlix Logo" />
          </Link>
        </div>

        <ul className="sidebar-nav">
          <li className={isActive("/home-page") ? "active" : ""}>
            <Link to="/home-page">
              <FontAwesomeIcon icon={faHome} />
              <small>Home</small>
            </Link>
          </li>
          <li className={isActive("/search-page") ? "active" : ""}>
            <Link to="/search-page">
              <FontAwesomeIcon icon={faSearch} />
              <small>Search</small>
            </Link>
          </li>
          <li className={isActive("/showtimes-page") ? "active" : ""}>
            <Link to="/showtimes-page">
              <FontAwesomeIcon icon={faClock} />
              <small>Showtimes</small>
            </Link>
          </li>
          <li className={isActive("/profile-page") ? "active" : ""}>
            <Link to="/profile-page">
              <FontAwesomeIcon icon={faUser} />
              <small>Profile</small>
            </Link>
          </li>
          <li className={isActive("/user-favourites") ? "active" : ""}>
            <Link to="/user-favourites">
              <FontAwesomeIcon icon={faHeart} />
              <small>Favorites</small>
            </Link>
          </li>
          <li className={isActive("/groups-page") ? "active" : ""}>
            <Link to="/groups-page">
              <FontAwesomeIcon icon={faUsers} />
              <small>Groups</small>
            </Link>
          </li>
          <li className={isActive("/reviews-page") ? "active" : ""}>
            <Link to="/reviews-page">
              <FontAwesomeIcon icon={faStar} />
              <small>Reviews</small>
            </Link>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="logout">
          {localStorage.getItem("token") ? (
            <button onClick={handleLogout} className="logout-btn">
              <FontAwesomeIcon icon={faSignOutAlt} />
              <small>Logout</small>
            </button>
          ) : (
            <Link to="/sign-in-page">
              <FontAwesomeIcon icon={faUser} />
              <small>Log In</small>
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} index />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route
            path="/tmdb-movie-details/:id"
            element={<TMDBMovieDetails />}
          />
          <Route
            path="/tmdb-to-finnkino-details"
            element={<TMDBtoFinkkinoMovieDetails />}
          />
          <Route
            path="/movie-reviews/:movieTitle/:releaseDate"
            element={<MovieReviewsPage />}
          />
          <Route path="/showtimes-page" element={<ShowtimesPage />} />
          <Route path="/search-page" element={<SearchPage />} />
          <Route path="/reviews-page" element={<ReviewsPage />} />
          <Route path="/sign-in-page" element={<SignInPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
          <Route path="/user-favourites" element={<UserFavourites />} />
          <Route
            path="/favorites/:favoriteID"
            element={<FavoriteGroupDetails />}
          />
          <Route path="/groups-page" element={<GroupsPage />} />
          <Route
            path="/my-group-details/:groupID"
            element={<MyGroupDetails />}
          />
          <Route
            path="/other-group-details/:groupID"
            element={<OtherGroupDetails />}
          />
          <Route path="/my-group-posts/:groupID" element={<MyGroupPosts />} />
          <Route path="/group-posts/:groupID" element={<OtherGroupPosts />} />
        </Routes>
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
