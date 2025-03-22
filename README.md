### In Progress to Change Database to SQlite over Postgresql to use application offline and enable local data storage
### DEMO
![Screenshot_20241025-011321_Expo Go](https://github.com/user-attachments/assets/cac2660d-e4c1-4280-a867-20257e8b6e97)
![Screenshot_20241025-011422_Expo Go](https://github.com/user-attachments/assets/b1455dd0-da52-453b-accc-d40c42eb3cea)
![Screenshot_20241025-011344_Expo Go](https://github.com/user-attachments/assets/33153852-01fe-4a88-bc07-4bed5e930934)
![Screenshot_20241025-011410_Expo Go](https://github.com/user-attachments/assets/75667d53-8dad-4ef3-98b7-cfd8e7d91781)
![Uploading Screenshot_20241025-011452_Expo Go.jpg…]()

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

## How to Run the Workout Tracker Application

Follow these steps to set up and run the workout tracker application locally:

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
2. **Expo CLI**: Install Expo CLI globally by running the following command in your terminal:
   ```bash
   npm install -g expo-cli
   ```
3. **PostgreSQL**: Set up PostgreSQL on your local machine. Make sure you have created a database named `workout` and the required tables (e.g., `users`, `workout`, `strength_workout`, etc.).

### Backend Setup

1. **Clone the Backend Repository**:
   ```bash
   git clone <your-backend-repo-url>
   cd <your-backend-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Database Connection**: 
   - Open the backend file where the database connection is established (as shown in the provided code).
   - Ensure the PostgreSQL connection details (username, password, database name) match your local setup.

4. **Start the Backend Server**:
   ```bash
   node index.js
   ```
   - Replace `index.js` with the main file of your backend if it's named differently.
   - Your backend server will run on `http://localhost:3000`.

### Frontend Setup

1. **Clone the Frontend Repository**:
   ```bash
   git clone <your-frontend-repo-url>
   cd <your-frontend-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo Development Server**:
   ```bash
   expo start
   ```

4. **Open the Application**:
   - Follow the instructions in the terminal to open the app on your mobile device using the Expo Go app or in an emulator.

### Testing the Application

1. **Create a User**: Use the registration page to create a new user account.
2. **Log Workouts**: Navigate to the workout logging page to log strength and cardio workouts.
3. **Track Progress**: Use the statistics tab to view your workout stats over different periods.

### Notes

- Ensure both the backend server and the frontend application are running simultaneously for the app to function correctly.
- If you encounter any issues, check the terminal for error messages and troubleshoot accordingly.
