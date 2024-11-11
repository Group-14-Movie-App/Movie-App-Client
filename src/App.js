import { Link, Route, Routes } from 'react-router-dom';
import HomePage from './screens/HomePage.js';
import ProfilePage from './screens/ProfilePage.js';
import MovieDetails from './screens/MovieDetails.js';
import CreateGroup from './screens/CreateGroup.js';


function App() 
{
  
  return(
    <div>

      <Link to={'/home-page'}>Home Page</Link> || 
      <Link to={'/profile-page'}>Profile Page</Link> || 
      <Link to={'/create-group'}>Create Group Page</Link> || 

      <Routes>
        <Route path='/home-page' element={<HomePage />} />
        <Route path='/profile-page' element={<ProfilePage />} />
        <Route path='/movie/:id' element={<MovieDetails />} /> {/* New route for movie details */}

        <Route path='/create-group' element={<CreateGroup />}/>
      </Routes>
    </div>
  )
  
}

export default App;
