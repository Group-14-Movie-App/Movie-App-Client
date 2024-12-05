import { Link, Route, Routes } from "react-router-dom";

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
import UserFavourites from "./screens/UserFavourites.js"; // Import UserFavourites component

// Groups Components
import GroupsPage from "./screens/GroupsMainPage.js";
import MyGroupDetails from "./components/Groups_Components/MyGroupDetails.js";
import OtherGroupDetails from "./components/Groups_Components/OtherGroupDetails.js";
import MyGroupPosts from "./components/Groups_Components/MyGroupPosts.js";
import OtherGroupPosts from "./components/Groups_Components/OtherGroupPosts.js";

// Favourites Components
import FavoriteGroupDetails from "./components/Profile_Components/FavoriteGroupDetails.js";

// Chatbot Component
import ChatBot from "./components/ChatBot.js";

import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faClock,
  faUser,
  faUsers,
  faStar,
  faHeart, // Heart icon for Favorites
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  return (
    <div className="d-flex">
      {/* Modern Sidebar Navigation */}
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li>
            <Link to="/home-page">
              <FontAwesomeIcon icon={faHome} />
              <small>Home</small>
            </Link>
          </li>
          <li>
            <Link to="/search-page">
              <FontAwesomeIcon icon={faSearch} />
              <small>Search</small>
            </Link>
          </li>
          <li>
            <Link to="/showtimes-page">
              <FontAwesomeIcon icon={faClock} />
              <small>Showtimes</small>
            </Link>
          </li>
          <li>
            <Link to="/profile-page">
              <FontAwesomeIcon icon={faUser} />
              <small>Profile</small>
            </Link>
          </li>
          <li>
            <Link to="/groups-page">
              <FontAwesomeIcon icon={faUsers} />
              <small>Groups</small>
            </Link>
          </li>
          <li>
            <Link to="/reviews-page">
              <FontAwesomeIcon icon={faStar} />
              <small>Reviews</small>
            </Link>
          </li>
          <li>
            <Link to="/user-favourites">
              <FontAwesomeIcon icon={faHeart} />
              <small>Favorites</small>
            </Link>
          </li>
        </ul>

        {/* Logout Button Positioned at Bottom */}
        <div className="logout">
          <Link to="/sign-in-page">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <small>Logout</small>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="content">
        <Routes>
          {/* General Pages */}
          <Route path="/" element={<HomePage />} index />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/profile-page" element={<ProfilePage />} />

          {/* Movie Pages */}
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

          {/* Showtimes and Search */}
          <Route path="/showtimes-page" element={<ShowtimesPage />} />
          <Route path="/search-page" element={<SearchPage />} />

          {/* Reviews */}
          <Route path="/reviews-page" element={<ReviewsPage />} />

          {/* Authentication Pages */}
          <Route path="/sign-in-page" element={<SignInPage />} />
          <Route path="/register-page" element={<RegisterPage />} />

          {/* Favorites Related Routes */}
          <Route path="/user-favourites" element={<UserFavourites />} />
          <Route
            path="/favorites/:favoriteID"
            element={<FavoriteGroupDetails />}
          />

          {/* Groups Related Routes */}
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

        {/* Chatbot Added*/}
        <ChatBot />
      </div>
    </div>
  );
}

export default App;
