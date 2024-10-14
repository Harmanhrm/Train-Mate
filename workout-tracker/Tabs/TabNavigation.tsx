import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutsToday from './WorkoutsTodayTab';
import LoginTab from './LoginTab';
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Workouts Today" component={WorkoutsToday} />
        <Tab.Screen name="Login" component={LoginTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;