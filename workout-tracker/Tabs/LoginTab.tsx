import axios from "axios";
import React, { useState } from "react";
import { View, Text, Alert, TextInput, Button} from "react-native";
import { SERVER_IP} from '@env';
import styles from '../css/loginStyles';
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
    <View style={styles.container} >
      <Text>Create Your Account</Text>
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