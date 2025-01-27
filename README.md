# 🌍 Atlas Journey Travel Diary App  

## Github Repository
https://github.com/Lawson-Hong-Duong/Atlas-TravelDiary-App

## 📜 Description  

The Travel Diary Application is designed to help users document their travel experiences, plan trips, and explore new destinations. The application targets travelers who want to keep a detailed record of their journeys, including diary entries, trip plans, and events. The data sources include user-generated content and external APIs for weather and event information.

##### Aims to enhance travelling by providing a platform where users can:
- Document journeys by creating diaries and adding chapters with text, photos, and styling options.
- Capture and display the user's location and current weather information automatically in each diary chapter.
- Organise detailed trip information by date.
- Use a budgeting tool that calculates the total cost of the trip to help manage expenses.
- Visualise diary chapters on a map with pinned locations.
- Search for local activities by city, date, and event type.
- Access current weather conditions and a 5-day forecast.
- Leveling system as user logs more trips and diaries.
- Visual aid to see how many trips and diaries added.

##### Target Users:
- Casual Travellers: Those who want to keep a private log of their travels or share with select individuals.
- Travel Influencers: Users who wish to share their travel experiences publicly.
- Travel Enthusiasts: Those who frequently explore new destinations and need a hub for documenting and planning trips.

## 🛠️ Tech Stack  

| Layer           | Technology                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| **Frontend**    | React.js, Mantine UI, Axios                                                |
| **Backend**     | Node.js, Express.js                                                       |
| **Database**    | MongoDB                                                                   |
| **APIs Used**   | OpenWeatherMap (weather), Stadia Maps (maps), Ticketmaster (event data)    |


# ✨ Implemented Features
##### User Authentication: 
- Secure user registration and login system.

##### Dashboard: 
- Centralised hub for accessing features and monitoring travel statistics.
- Shortcuts to next upcoming trip, or latest diary entry.
- User XP Leveling system.

##### 📖 Diary Creation and Management:
- Ability to create diaries and add chapters.
- Text editor with styling options.
- Upload photos to chapters.
- Automatic location and weather data integration.
- Public or private visibility settings for diaries.
- Shareable links for public diaries.

##### 🗓️ Trip Planner:
- Organise trips with detailed information.
- Add flights, accommodations, activities, ferries, trains, events, restaurants and notes.
- Budgeting tool to manage and calculate expenses.

##### 🗺️ Map View: 
- Visual representation of diary chapters on a map with pinned locations.

##### 🎟️ Events Page: 
- Search and explore local events by city, date, and type.

##### ☁️ Weather Page: 
- Access to current weather conditions and a 5-day forecast.

# Milestones Achieved
##### Sprint 1:
- Implemented secure registration and login.
- Established diary creation with photo uploads.
- Integrated weather data.
- Implemented geotagging.

##### Sprint 2:
- Created trip planning feature.
- Developed map view for diary chapters.

##### Sprint 3:
- Developed weather page.
- Developed budgeting feature to track expenses.

##### Sprint 4:
- Integrated event exploration.
- Enhanced UI.
- Conducted testing.

# Project Structure
### Backend (server): Built with Node.js and Express.js.
##### Routes:
- auth.js: User authentication and account management.
- diaries.js: CRUD operations for diaries and chapters.
- trips.js: Trip planning functionalities.
- events.js: Fetching events from external API.
- geocode.js: Fetching location data.
- weather.js: Fetching weather data.

##### Middleware:
- authMiddleware.js: Protects routes and manages authentication.
- optionalAuthMiddleware.js: Allows optional authentication for public diaries.

##### Models:
- User.js: User schema and model.
- Diary.js: Diary schema and model.
- Trip.js: Trip schema and model.

### Frontend (client): Built with React.js and Mantine UI components.
##### Pages:
- AddChapter.jsx: Page for adding a new chapter to a diary.
- AddTripInfo.jsx: Page for adding information to a trip.
- Chapters.jsx: Displays chapters within a diary.
- Dashboard.jsx: User dashboard showing summaries.
- Diaries.jsx: Lists all diaries created by the user.
- Events.jsx: Allows users to search for local events.
- Home.jsx: Landing page.
- Login.jsx: User login page.
- Map.jsx: Visual representation of diary entries on a map.
- Signup.jsx: User registration page.
- TripInfo.jsx: View of a specific trip's information.
- Trips.jsx: Lists all trips planned by the user.
- Weather.jsx: Displays current weather and forecasts.

##### Components:
- MantineLogo.jsx: Custom logo using Mantine UI.
- Navbar.jsx: Navigation bar.
- ProtectedRoute.jsx: protects routes that require authentication.

##### Context:
- AuthContext.jsx: Context API for managing authentication state.

##### Data:
- infoTypes.js: Contains configuration for different types of trip information.

##### Frontend Root:
- api.js: Sets up Axios instances and configurations for API calls to the backend.
- App.jsx: Main app component that includes routing logic using React Router.
- main.jsx: Entry point of the React app.

# Future Developments

- **Enhanced User Profiles**: Allow users to customize their profiles with more details and preferences.
- **Social Features**: Implement social features such as following other users, liking, and commenting on diary entries.
- **Advanced Search**: Improve the search functionality to allow users to search for diary entries, trips, and events more effectively.
- **Mobile App**: Develop a mobile app version of the application for iOS and Android.

# Testing Credentials
- **Email:** test@user.com
- **Password:** TestPass123
