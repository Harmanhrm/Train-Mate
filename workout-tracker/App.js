// App.js
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './Tabs/TabNavigation';
import { SQLiteProvider } from 'expo-sqlite/next';

const Stack = createStackNavigator();

async function setupDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_id INTEGER,
      type_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    );

    CREATE TABLE IF NOT EXISTS strength_workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      set_number INTEGER,
      reps INTEGER,
      weight REAL,
      rpe INTEGER,
      FOREIGN KEY (workout_id) REFERENCES workouts (id)
    );

    CREATE TABLE IF NOT EXISTS cardio_workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER,
      distance TEXT,
      calories TEXT,
      speed TEXT,
      time TEXT,
      FOREIGN KEY (workout_id) REFERENCES workouts (id)
    );

    INSERT OR IGNORE INTO categories (id, name) VALUES 
      (1, 'Upper Body'),
      (2, 'Lower Body'),
      (3, 'Core'),
      (4, 'Cardio'),
      (5, 'Full Body');
  `);
}

function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="fitness.db" onInit={setupDatabase}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Main"
              component={TabNavigation}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SQLiteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;