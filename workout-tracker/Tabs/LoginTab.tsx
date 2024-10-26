import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { SERVER_IP } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginTab = ({ navigation }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [userDetails, setUserDetails] = useState(null);

  const handleLogin = async () => {
    const { username, password } = credentials;

    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`http://${SERVER_IP}:3000/login`, {
        username,
        password
      });

      if (!response.data || !response.data.token || !response.data.id) {
        throw new Error('Invalid response data');
      }

      await AsyncStorage.setItem('userToken', response.data.token);
      setUserDetails(response.data);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert(
        'Error', 
        error.response?.status === 401 
          ? 'Invalid username or password'
          : 'Failed to login. Please try again.'
      );
    }
  };

  useEffect(() => {
    if (userDetails) {
      navigation.navigate('Main', { userDetails });
    }
  }, [userDetails]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={credentials.username}
        onChangeText={(text) => setCredentials({ ...credentials, username: text })}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={credentials.password}
        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

    container: {
  
      flex: 1,
  
      justifyContent: 'center',
  
      padding: 16,
  
      backgroundColor: '#fff',
  
    },
  
    title: {
  
      fontSize: 24,
  
      fontWeight: 'bold',
  
      marginBottom: 24,
  
      textAlign: 'center',
  
      color: '#333',
  
    },
  
    input: {
  
      height: 40,
  
      borderColor: '#ccc',
  
      borderWidth: 1,
  
      marginBottom: 12,
  
      paddingHorizontal: 8,
  
    },
    linkText: {
        color: '#007BFF',
        fontSize: 16,
        textAlign: 'center',
      },
  
    button: {
  
      backgroundColor: '#007BFF',
  
      padding: 10,
  
      borderRadius: 5,
  
      alignItems: 'center',
  
    },
  
    buttonText: {
  
      color: '#fff',
  
      fontSize: 16,
  
    },
  
    errorText: {
  
      color: 'red',
  
      marginBottom: 12,
  
      textAlign: 'center',
  
    },
  
    linkButton: {
  
      marginTop: 20,
  
      alignItems: 'center',
  
    },
  
  });
  

export default LoginTab;