import { Link, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import HomePage from "./screens/HomePage.js";
import ProfilePage from "./screens/ProfilePage.js";
import MovieDetailsPage from "./screens/MovieDetailsPage.js";
import ShowtimesPage from "./screens/ShowtimesPage.js";
import SearchPage from "./screens/SearchPage.js";
import ReviewsPage from "./screens/ReviewsPage.js";
import SignInPage from "./screens/SignInPage.js";
import RegisterPage from "./screens/RegisterPage.js";
import GroupsPage from "./screens/GroupsPage.js";
import MovieReviewsPage from "./screens/MovieReviewsPage.js"; // Import the new component
import GroupDetails from "./components/Groups_Components/GroupDetails.js";
import GroupCard from "./components/Groups_Components/GroupCard.js"; 
import "./App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faClock,
  faUser,
  faUsers,
  faStar,
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
          {/* Set HomePage as default page */}
          <Route path="/" element={<HomePage />} index />
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetailsPage />} />
          <Route path="/showtimes-page" element={<ShowtimesPage />} />
          <Route path="/search-page" element={<SearchPage />} />
          <Route path="/groups-page" element={<GroupsPage />} />
          <Route path="/reviews-page" element={<ReviewsPage />} />
          <Route path="/sign-in-page" element={<SignInPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
          {/* New route for displaying reviews of a specific movie */}
          <Route path="/movie-reviews/:movieTitle" element={<MovieReviewsPage />} />
         {/* Home route for rendering all group cards */}
        <Route path="/" element={<GroupList />} />
        {/* Group details route */}
        <Route path="/group-details/:groupId" element={<GroupDetailsWrapper />} />
      </Routes>
      </div>
    </div>
  );
}
const GroupList = () => {
  const groups = [
    { groupid: "1", groupname: "Movie Lovers", description: "A group for movie fans" },
    { groupid: "2", groupname: "Tech Geeks", description: "Discuss technology trends" },
  ];

  return (
    <div>
      <h1>All Groups</h1>
      <div className="group-list">
        {groups.map((group) => (
          <GroupCard key={group.groupid} group={group} isMyGroup={false} />
        ))}
      </div>
    </div>
  );
};

// Wrapper for GroupDetails to pass groupId from URL
const GroupDetailsWrapper = () => {
  const { groupId } = useParams();
  return <GroupDetails groupId={groupId} />;
};


export default App;
