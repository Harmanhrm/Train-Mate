
// Updated TabNavigation.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutsToday from './WorkoutsTodayTab';
import CategoriesTab from './CategoriesTab';
import StatisticsTab from './StatisticsTab';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigation = ({ userDetails }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Workouts Today') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Statistics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Workouts Today">
        {props => <WorkoutsToday/>}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigation;