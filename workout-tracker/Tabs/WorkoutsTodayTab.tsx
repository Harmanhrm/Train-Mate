import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Modal, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_IP } from '@env';

const WorkoutsToday = ({ userDetails }) => {
  const [workouts, setWorkouts] = useState<{ id: number; details: string; type: string }[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutType, setWorkoutType] = useState('cardio');
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    categoryId: null,
    typeId: null,
    userId: userDetails.id,
  });
  const [categories, setCategories] = useState([]);
  const [strengthSets, setStrengthSets] = useState([
    {
      set_number: 1,
      reps: '',
      weight: '',
      rpe: '',
    },
  ]);
  const [newCardioWorkout, setNewCardioWorkout] = useState({
    distance: '',
    calories: '',
    speed: '',
    time: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimer, setSearchTimer] = useState(null);

  useEffect(() => {
    fetchWorkouts();
    fetchCategories();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:3000/workout`);
      setWorkouts(response.data);
    } catch (error) {
      console.log('Error', 'Failed to fetch workouts');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:3000/categories`);
      setCategories(response.data);
    } catch (error) {
      console.log('Error', 'Failed to fetch categories');
    }
  };

  const searchWorkouts = async (name) => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:3000/search-workouts`, { params: { name } });
      setSearchResults(response.data);
    } catch (error) {
      console.log('Error', 'Failed to search workouts');
    }
  };

  const handleNameChange = (text) => {
    setNewWorkout({ ...newWorkout, name: text });
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    if (text.trim() !== '') {
      setSearchTimer(setTimeout(() => searchWorkouts(text), 300));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddWorkout = async () => {
    try {
      const workoutData = {
        ...newWorkout,
        typeId: workoutType === 'cardio' ? 2 : 1,
        cardioDetails: workoutType === 'cardio' ? newCardioWorkout : null,
        strengthDetails: workoutType === 'strength' ? strengthSets : null,
      };

      console.log('Sending workout data:', workoutData);

      const workoutResponse = await axios.post(`http://${SERVER_IP}:3000/workout`, workoutData);

      console.log('Workout added successfully:', workoutResponse.data);

      fetchWorkouts();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding workout:', error);
      Alert.alert('Error', 'Failed to add workout');
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addStrengthSet = () => {
    setStrengthSets([
      ...strengthSets,
      {
        set_number: strengthSets.length + 1,
        reps: '',
        weight: '',
        rpe: '',
      },
    ]);
  };

  const renderWorkoutFields = () => {
    if (workoutType === 'cardio') {
      return (
        <>
          <TextInput
            style={styles.input}
            placeholder="Distance"
            value={newCardioWorkout.distance}
            onChangeText={(text) => setNewCardioWorkout({ ...newCardioWorkout, distance: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Calories"
            value={newCardioWorkout.calories}
            onChangeText={(text) => setNewCardioWorkout({ ...newCardioWorkout, calories: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Speed"
            value={newCardioWorkout.speed}
            onChangeText={(text) => setNewCardioWorkout({ ...newCardioWorkout, speed: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={newCardioWorkout.time}
            onChangeText={(text) => setNewCardioWorkout({ ...newCardioWorkout, time: text })}
          />
        </>
      );
    } else if (workoutType === 'strength') {
      return (
        <>
          {strengthSets.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <Text>Set {set.set_number}</Text>
              <TextInput
                style={styles.input}
                placeholder="Reps"
                value={set.reps}
                onChangeText={(text) => {
                  const newSets = [...strengthSets];
                  newSets[index].reps = text;
                  setStrengthSets(newSets);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Weight"
                value={set.weight}
                onChangeText={(text) => {
                  const newSets = [...strengthSets];
                  newSets[index].weight = text;
                  setStrengthSets(newSets);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="RPE"
                value={set.rpe}
                onChangeText={(text) => {
                  const newSets = [...strengthSets];
                  newSets[index].rpe = text;
                  setStrengthSets(newSets);
                }}
              />
            </View>
          ))}
          <Button title="Add Set" onPress={addStrengthSet} />
        </>
      );
    }
  };

  const renderCategoryDropdown = () => (
    <Picker
      selectedValue={newWorkout.categoryId}
      style={styles.input}
      onValueChange={(itemValue) => setNewWorkout({ ...newWorkout, categoryId: itemValue })}
    >
      {categories.map((category) => (
        <Picker.Item key={category.id} label={category.name} value={category.id} />
      ))}
    </Picker>
  );

  const renderSearchResults = () => (
    newWorkout.name.trim() !== '' && searchResults.map((result) => (
      <TouchableOpacity key={result.id} onPress={() => setNewWorkout({ ...newWorkout, name: result.name })}>
        <Text style={styles.searchResult}>{result.name}</Text>
      </TouchableOpacity>
    ))
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Welcome, {userDetails.username}!</Text>
      <Button title="Add Workout" onPress={() => setModalVisible(true)} />
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Accordion
            title={`Workout ${item.id}`}
            expanded={expanded[item.id]}
            onPress={() => toggleExpand(item.id)}
          >
            <Text>{item.details}</Text>
          </List.Accordion>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newWorkout.name}
            onChangeText={handleNameChange}
          />
          {renderSearchResults()}
          {renderCategoryDropdown()}
          <Picker
            selectedValue={workoutType}
            style={styles.input}
            onValueChange={(itemValue) => setWorkoutType(itemValue)}
          >
            <Picker.Item label="Cardio" value="cardio" />
            <Picker.Item label="Strength" value="strength" />
          </Picker>
          {renderWorkoutFields()}
          <Button title="Add Workout" onPress={handleAddWorkout} />
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10
  },
  setContainer: {
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  searchResult: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '80%',
  },
});

export default WorkoutsToday;