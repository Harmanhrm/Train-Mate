import React, { useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

export function DatabaseInitializer({ children }) {
  const db = useSQLiteContext();

  useEffect(() => {
    async function initDatabase() {
      try {
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
        `);

        // Insert default categories if they don't exist
        await db.execAsync(`
          INSERT OR IGNORE INTO categories (id, name) VALUES 
            (1, 'Upper Body'),
            (2, 'Lower Body'),
            (3, 'Core'),
            (4, 'Cardio'),
            (5, 'Full Body');
        `);

        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    }

    initDatabase();
  }, []);

  return children;
}