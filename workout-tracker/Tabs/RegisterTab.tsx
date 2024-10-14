import axios from "axios";
import React, { useState } from "react";
import { View, Text, Alert, TextInput, TouchableOpacity } from "react-native";
import { SERVER_IP } from '@env';
import styles from '../css/loginStyles';

const RegisterTab = () => {
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });

  const checkUsernameAvailability = async (username) => {
    if (username.length < 6) {
      setIsUsernameAvailable(false);
      return;
    }
    try {
      const response = await axios.get(`http://${SERVER_IP}:3000/users?username=${username}`);
      setIsUsernameAvailable(response.data.length === 0);
    } catch (error) {
      console.error('Error checking username availability:', error);
    }
  };

  const handleRegister = async () => {
    const { username, password, confirmPassword, email } = newUser;

    if (!username || !password || !confirmPassword || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (username.length < 6) {
      Alert.alert('Error', 'Username must be at least 6 characters long.');
      return;
    }

    if (!isUsernameAvailable) {
      Alert.alert('Error', 'Username is already taken.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      console.log('sending post request to ' + SERVER_IP, newUser);
      const response = await axios.post(`http://${SERVER_IP}:3000/users`, {
        username,
        password,
        email
      });
      console.log('User registered', response.data);
      Alert.alert('Success', 'User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Error', 'Failed to register user ' + username);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Your Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={newUser.username}
        onChangeText={(text) => {
          setNewUser({ ...newUser, username: text });
          checkUsernameAvailability(text);
        }}
        autoCapitalize="none"
      />
      {!isUsernameAvailable && (
        <Text style={styles.errorText}>Username is already taken or too short.</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={newUser.email}
        onChangeText={(text) => setNewUser({ ...newUser, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={newUser.password}
        onChangeText={(text) => setNewUser({ ...newUser, password: text })}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={newUser.confirmPassword}
        onChangeText={(text) => setNewUser({ ...newUser, confirmPassword: text })}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterTab;