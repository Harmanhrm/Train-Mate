import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Modal, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { List } from 'react-native-paper';

const WorkoutsToday = () => {
  const [workouts, setWorkouts] = useState<{ id: number; details: string }[]>([]);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    categoryId: 1,
    typeId: 1,
    userId: 1,
    sets: '',
    reps: '',
    weight: '',
    rpe: '',
    distance: '',
    calories: '',
    speed: '',
    time: '',
    hold_time: ''
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/workout');
      setWorkouts(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch workouts');
    }
  };

  const handleAddWorkout = async () => {
    try {
      await axios.post('http://localhost:3000/workout', newWorkout);
      fetchWorkouts();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add workout');
    }
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
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
        <View style={styles.modalView}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newWorkout.name}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Sets"
            value={newWorkout.sets}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, sets: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Reps"
            value={newWorkout.reps}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, reps: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Weight"
            value={newWorkout.weight}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, weight: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="RPE"
            value={newWorkout.rpe}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, rpe: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Distance"
            value={newWorkout.distance}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, distance: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Calories"
            value={newWorkout.calories}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, calories: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Speed"
            value={newWorkout.speed}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, speed: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Time"
            value={newWorkout.time}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, time: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Hold Time"
            value={newWorkout.hold_time}
            onChangeText={(text) => setNewWorkout({ ...newWorkout, hold_time: text })}
          />
          <Button title="Add Workout" onPress={handleAddWorkout} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
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
  }
});

export default WorkoutsToday;