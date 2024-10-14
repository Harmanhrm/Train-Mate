import axios from "axios";
import React, { useState } from "react";
import { View, Text, Alert, TextInput, Button, StyleSheet } from "react-native";
import { config } from 'dotenv';
config();
const ip = process.env.SERVER_IP;
const LoginTab = () => {
    const [newUser, setNewUser] = useState({
        username: '',
        password: ''
      });
    
    const handleAddUser = async () => {
        try {
            console.log('sending post request', newUser);
          const response = await axios.post(`http://${ip}:3000/users`, {
            username: newUser.username,
            password: newUser.password
          });
          console.log('User added'), response.data;
          } 
         catch (error) {
          Alert.alert('Error', 'Failed to add user ' + newUser.username + ' with password ' + newUser.password);
        }
      };
  return (
    <View>
      <Text>Login</Text>
      <TextInput
            placeholder="username"
            value={newUser.username}
            onChangeText={(text) => setNewUser({ ...newUser, username: text })}
          />
        <TextInput
            placeholder="password"
            value={newUser.password}
            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
          />
          <Button title="Submit" onPress={handleAddUser} />
    </View>
  );
};

export default LoginTab;