# Movie App Frontend 🎥

Live Application: [Finnflix Movie App](https://finnflix-movie-app-client.onrender.com/)

*Note: The frontend, backend, and database are deployed using Render.com's free plan, so the application might run a bit slow.*

A React-based web application designed to provide a seamless experience for movie enthusiasts. This document covers the installation and setup process specifically for the frontend of the application.

---

## Table of Contents

- [Overview](#overview)
- [Team Members](#team-members)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation Process](#installation-process)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [User Interface Plan](#user-interface-plan)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This web application targets movie enthusiasts with a variety of features to enhance their experience. Users can view information about movies, showtimes in theaters, manage their accounts, and write or browse reviews. The app uses open-source data from TMDB (The Movie Database) and Finnkino to provide complete movie and theater information.

---

## Team Members

Our team of six members contributed to both frontend and backend tasks:

- **Heejin Jeong**: Sign-In and Register Pages
- **Xuan Zhao**: Home and Search Pages
- **Nipuni Kodikara** & **Pabitra Kunwar**: Groups Page, Group Details, and Group Posts
- **Annika Repo**: Reviews Page and Profile Page
- **Ryan Wickramaratne**: Showtime Page, Profile Page, finalizing all pages by fixing errors, and enhancing CSS styling

We collaborated effectively to ensure a seamless user experience and functionality.

---

## Features

- **User Account Management**: People can register using the Register Page, log in using the Sign-In Page, and manage their user accounts with the Profile Page after logging in.

- **Movies Display**: Movies are categorized into Popular Movies and Upcoming Movies sections (fetched from the TMDB API). The "Now Playing" section fetches movies from Finnkino. Movie cards and their contents are fetched by the corresponding APIs. If a movie exists in both TMDB and Finnkino APIs, it can be routed using the "Now Showing" button displayed on the Movie Details Page.

- **Movie Search and Filter**: Users can search for movies on the Search Page by title, genre, release date range, or popularity (ascending or descending). If users search in Finnish and the movie exists in the Finnkino API, the results will be displayed with English movie names.

- **Showtimes Display**: The Showtimes Page displays schedules fetched from Finnkino, filtered by city and movie name.

- **Browse Movie Details and Trailers**: Details fetched from APIs (TMDB or Finnkino) are accessible from the Home Page, Search Page, and Showtimes Page. Movie trailers are fetched from YouTube and included as an extra feature. Users can rate movies and add them to favorite groups.

- **Reviews**: Users can add reviews from the Movie Details Page, browse them on the Reviews Page, and filter movies by review ratings (above 80% or below). Users can edit or delete their own reviews.

- **Groups**: Signed-in users can create a single group, join groups, cancel join requests, add posts, edit or delete posts, and send movie invitations by selecting showtimes within the group. Group owners can delete groups, remove members, and manage posts.

- **Favorites**: Logged-in users can create favorite groups via the Profile Page, edit group names, delete groups, and add or remove movies from favorite groups on the Favorites Page. Links to favorite groups can be shared via WhatsApp, Facebook, Twitter, or Telegram, and copied to the clipboard.

- **Profile**: Users can view and edit their profile details, delete their profile, and log out. Profile, Favorites, and Groups pages are restricted to logged-in users.

- **Chatbot**: A chatbot powered by OpenAI API is available at the bottom right corner. Users can search for movie details, showtimes, and clear the chat as needed.

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

## Installation Process

### Prerequisites

Ensure the following are installed on your system:

- Node.js (>=14.x)
- npm (>=6.x)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Group-14-Movie-App/Movie-App-Client.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Movie-App-Client
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy the `.env.example` file to create your own `.env` file:

   ```bash
   cp .env.example .env
   ```

---

## Environment Variables

In the `.env` file, fill in the following fields:

```env
# TMDB API Key
REACT_APP_TMDB_API_KEY=YOUR_TMDB_API_KEY
TMDB_API_KEY=YOUR_TMDB_API_KEY

# YouTube API Key
REACT_APP_YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY

# Backend URL
# Use the localhost URL for local development or the deployed backend URL for production.
REACT_APP_BACKEND_URL=http://localhost:5000
# or
REACT_APP_BACKEND_URL=https://movieapp-backend1.onrender.com
```

- Replace `YOUR_TMDB_API_KEY` with your TMDB API Key.
- Replace `YOUR_YOUTUBE_API_KEY` with your YouTube API Key.
- Set `REACT_APP_BACKEND_URL` to `http://localhost:5000` for local development or `https://movieapp-backend1.onrender.com` to connect to the deployed backend.

---

## Running the Application

To start the frontend development server, run:

```bash
npm start
```

By default, the application will be accessible at `http://localhost:3000` in your browser.

---

## User Interface Plan

The application is structured into key sections:

- **Home Page**: Features navigation and displays popular movies.
- **Authentication**: Includes Sign-Up and Log-In pages.
- **Search**: Filter movies by criteria and view detailed information.
- **Showtimes**: Displays schedules from Finnkino theaters.
- **Profile**: Manage user accounts and profiles.
- **Groups**: Create, join, and customize groups, and interact with members.
- **Reviews**: Add and browse movie reviews.
- **Favorites**: Manage and share favorite movie lists.

For more details, view the following resources:
- **Figma UI Design**: [Figma UI Design](https://www.figma.com/design/Um23jxZOoDbHIjjAZuTNMW/Movie-App-Group-14?node-id=5-1281&t=zMdASt7FiUUvEGga-1)
- **Database Diagram**: [Database Diagram](https://lucid.app/lucidchart/7f68d074-315e-445d-bf61-f620f06f2bb2/edit?viewport_loc=-892%2C-834%2C3461%2C2162%2C0_0&invitationId=inv_33414b18-a92e-415b-ae38-9849861a0d58)
- **Class Diagram**: [Class Diagram](https://lucid.app/lucidchart/800b45f2-0726-4129-9ba7-e4450143994f/edit?viewport_loc=-261%2C-386%2C3870%2C2418%2C0_0&invitationId=inv_72f589c6-6e87-4f30-a8ff-26f286282d1c)
- **ERD Diagram**: [ERD Diagram](https://lucid.app/lucidchart/5702ae09-34a6-462e-a537-0b966b53215d/edit?viewport_loc=-42%2C-100%2C2293%2C1256%2C0_0&invitationId=inv_156754b4-078d-4ff6-a828-7eb5d56e2d10)

---


---

## License

This project is licensed under the [MIT License](LICENSE).

