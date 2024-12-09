# Movie App - Group 14  

### Team Members  
- **Ryan Wickramaratne**  
- **Xuan Zhao**  
- **Pabitra Kunwar**  
- **Heejin Jeong**  
- **Annika Repo**  
- **Nipuni Kodikara**  

## Overview  
This web application is designed for movie enthusiasts, providing a variety of features to enhance their experience. Users can explore movie details, view showtimes, manage accounts, and interact with other users through reviews and group activities.  

The app leverages open-source data from **TMDB (The Movie Database)** and **Finnkino** to offer comprehensive information about movies and theater schedules.  

---

## Features  
- **User Account Management**: Sign up, log in, and manage user accounts.  
- **Movie Search and Filter**: Search movies by title, genre, or release year.  
- **Showtimes Display**: View showtimes from Finnkino.  
- **Groups**: Create, join, and manage group pages.  
- **Reviews**: Add, browse, and manage movie reviews.  
- **Favorites**: Create, share, and manage favorite movie lists.  

---

## Technologies Used  
- **Frontend**: React.js  
- **Backend**: Node.js with Express.js  
- **Database**: PostgreSQL  
- **Authentication**: JSON Web Tokens (JWT)  
- **APIs**: TMDB and Finnkino (XML format)  
- **Development Tools**: Visual Studio Code, GitHub  
- **Deployment**: Render.com  

---

## Team Contributions  
Our six-member team worked collaboratively on both the frontend and backend tasks:  
- **Heejin Jeong**: Sign-In and Register Pages.  
- **Xuan Zhao**: Home and Search Pages.  
- **Nipuni Kodikara & Pabitra Kunwar**: Groups Page, Group Details, and Group Posts.  
- **Annika Repo**: Reviews Page and Profile Page.  
- **Ryan Wickramaratne**: Showtime Page, Profile Page, and finalizing all pages by resolving errors and enhancing CSS styling.  

---

## Architecture  
The app follows an **MVC (Model-View-Controller)** structure:  
- **Frontend (View)**: Built with React.js, communicates with the backend using native Fetch API.  
- **Backend (Controller)**: Node.js and Express.js manage API requests, authentication, and database interactions.  
- **Database (Model)**: PostgreSQL stores user data, movie details, reviews, groups, and favorites.  

---

## User Interface Plan  
The application includes the following sections:  
1. **Home Page**: Features navigation and displays popular movies.  
2. **Authentication**: Includes Sign-Up and Log-In pages.  
3. **Search**: Filter movies by criteria and view detailed information.  
4. **Showtimes**: Displays schedules from Finnkino theaters.  
5. **Profile**: Manage user accounts and profiles.  
6. **Groups**: Create, join, and customize groups, and interact with members.  
7. **Reviews**: Add and browse movie reviews.  
8. **Favorites**: Manage and share favorite movie lists.  

[Figma UI Design](https://www.figma.com/design/Um23jxZOoDbHIjjAZuTNMW/Movie-App-Group-14?node-id=5-1281&t=zMdASt7FiUUvEGga-1)  

---

## Installation  

### Prerequisites  
- Node.js installed  
- Git installed  

### Steps  
1. Clone the repositories:  
   - **Frontend**:  
     ```bash
     git clone https://github.com/Group-14-Movie-App/Movie-App.git
     ```  
   - **Backend**:  
     ```bash
     git clone https://github.com/Group-14-Movie-App/Movie-App-Server.git
     ```  

2. Install dependencies:  
   - **Frontend**:  
     ```bash
     cd Movie-App
     npm install
     ```  
   - **Backend**:  
     ```bash
     cd Movie-App-Server
     npm install
     ```  

3. Set up environment variables for API keys and database configuration.  

4. Start the project:  
   - **Frontend**:  
     ```bash
     npm start
     ```  
   - **Backend**:  
     ```bash
     npm run devStart
     ```  

---

## Usage  
- Register or log in to explore the app's features.  
- Search for movies, view showtimes, create groups, share thoughts and movie details, and manage reviews and favorites.  

---

## Live Application  
The live application is yet to be deployed.  
                                                                                                              