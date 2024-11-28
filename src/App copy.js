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
import GroupsPage from "./screens/GroupsMainPage.js";
import MovieReviewsPage from "./screens/MovieReviewsPage.js"; // Import the new component
import MyGroupDetails from "./components/Groups_Components/MyGroupDetails.js";
import OtherGroupDetails from "./components/Groups_Components/OtherGroupDetails.js";
import OtherGroupPosts from "./components/Groups_Components/OtherGroupPosts.js";
import MyGroupPosts from "./components/Groups_Components/MyGroupPosts.js";

import UserFavourites from "./screens/UserFavourites.js"; // Import the UserFavourites component

import GroupCard from "./components/Groups_Components/GroupCard.js"; 
import TMDBMovieDetails from "./screens/TMDBMovieDetails.js";
import TMDBtoFinkkinoMovieDetails from "./screens/TMDBtoFinkkinoMovieDetails.js";
import FavoriteGroupDetails from "./components/Profile_Components/FavoriteGroupDetails.js";
import "./App.css";

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

          <li>
            <Link to="/user-favourites">
              <FontAwesomeIcon icon={faHeart} />
              <small>Favorites</small>
            </Link>
          </li>

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
          <Route path="/tmdb-movie-details/:id" element={<TMDBMovieDetails />} />
          <Route path="/tmdb-to-finnkino-details" element={<TMDBtoFinkkinoMovieDetails />} />


          <Route path="/showtimes-page" element={<ShowtimesPage />} />          
          <Route path="/search-page" element={<SearchPage />} />
          
          <Route path="/reviews-page" element={<ReviewsPage />} />
          <Route path="/sign-in-page" element={<SignInPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
          {/* New route for displaying reviews of a specific movie */}
          <Route path="/movie-reviews/:movieTitle/:releaseDate" element={<MovieReviewsPage />} />

         {/* Home route for rendering all group cards */}
        <Route path="/" element={<GroupList />} />
        {/* Group details route */}
        


        {/* Favourites Related routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/favorites/:favoriteID" element={<FavoriteGroupDetails />} />

        {/* Groups Related routes */}
        <Route path="/groups-page" element={<GroupsPage />} />
        <Route path="/my-group-details/:groupID" element={<MyGroupDetails />} />
        <Route path="/other-group-details/:groupID" element={<OtherGroupDetails />} />

        <Route path="/group-posts/:groupID" element={<OtherGroupPosts />} />
        <Route path="/my-group-posts/:groupID" element={<MyGroupPosts />} />

        <Route path="/user-favourites" element={<UserFavourites />} />

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
  return <MyGroupDetails groupId={groupId} />;
};


export default App;
