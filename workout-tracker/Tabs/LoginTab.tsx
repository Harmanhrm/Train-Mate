import axios from "axios";
import React, { useState } from "react";
import { View, Text, Alert, TextInput, Button, StyleSheet } from "react-native";
import { SERVER_IP} from '@env';

const LoginTab = () => {
    const [newUser, setNewUser] = useState({
        username: '',
        password: ''
      });
    
    const handleAddUser = async () => {
        try {
            console.log('sending post request' + SERVER_IP, newUser);
          const response = await axios.post(`http://${SERVER_IP}:3000/users`, {
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
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: 'white',
    },
  });
export default LoginTab;