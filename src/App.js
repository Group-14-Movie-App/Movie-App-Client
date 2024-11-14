import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './screens/HomePage.js';
import ProfilePage from './screens/ProfilePage.js';
import MovieDetailsPage from './screens/MovieDetailsPage.js';
import ShowtimesPage from './screens/ShowtimesPage.js';
import SearchPage from './screens/SearchPage.js';
import GroupsPage from './screens/GroupsPages/CreateGroups.js';
import ReviewsPage from './screens/ReviewsPage.js';
import SignInPage from './screens/SignInPage.js';
import RegisterPage from './screens/RegisterPage.js';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faClock, faUser, faUsers, faStar, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

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
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/showtimes-page" element={<ShowtimesPage />} />
          <Route path="/search-page" element={<SearchPage />} />
          <Route path="/groups-page" element={<GroupsPage />} />
          <Route path="/reviews-page" element={<ReviewsPage />} />
          <Route path="/sign-in-page" element={<SignInPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
