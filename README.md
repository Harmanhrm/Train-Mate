
# Workout Tracker App
Ever forgotten to log your workouts or spent hours trying to find the perfect system to track your progress? 

This workout tracker is the custom-built solution you've been waiting for!
It scales with your fitness journey, adapting to your own workouts and categories. Whether you're just starting out or a seasoned gym-goer, this app lets you go at your own pace while keeping everything organized.

## Tech Stack

- **Frontend**: React Native with expo go
- **Backend**: Express.js with PostgreSQL as the database
- **API Communication**: Axios for handling HTTP requests
- **Authentication**: JSON Web Tokens (JWT) for secure login and session management
- **Database**: PostgreSQL (data stored in relational tables for users, workouts, strength/cardio exercises)

## Features

- **User Management**: Sign up, log in, and manage user profiles.
- **Workout Logging**: Add workouts dynamically with support for both **strength** and **cardio** exercises.
- **Real-Time Tracking**: Fetch statistics on workout volume, including daily, weekly, and all-time sets.
- **Categories and Search**: Organize workouts into custom categories and search through logged workouts.
- **Token-Based Authentication**: Secure endpoints using **JWT tokens** for authentication.
- **Statistical Insights**: Easily track your workout progress through aggregated stats.
- **Custom Workouts**:
- Users can create custom workouts and organize them under categories (e.g., strength, cardio).
- Each workout can consist of multiple sets and exercises, dynamically added using React’s state management

## Tech Stack

- **Backend**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Data Handling**: Axios for HTTP requests, bodyParser for JSON parsing
- **Cross-Origin Resource Sharing**: Managed using CORS for secure API access

## How to Run

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up PostgreSQL and configure your credentials in the `Pool` constructor.
4. Run the server: `node app.js`.
5. API will be available at `http://localhost:3000`.
