import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './Tabs/TabNavigation';
import RegisterTab from './Tabs/RegisterTab';
import LoginTab from './Tabs/LoginTab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_IP } from '@env';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const checkLoginState = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
        try {
          const response = await axios.get(`http://${SERVER_IP}:3000/user-details`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserDetails(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
          await AsyncStorage.removeItem('userToken');
          setUserToken(null);
        }
      }
      setIsLoading(false);
    };

    checkLoginState();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userToken ? "Main" : "Login"}>
        <Stack.Screen 
          name="Login" 
          component={LoginTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          options={{ headerShown: false }}>
          {props => <TabNavigation {...props} userDetails={userDetails} />}
        </Stack.Screen>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
});

export default App;