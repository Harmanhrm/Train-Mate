import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, Modal, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_IP } from '@env';

const Categories = ({ userDetails }) => {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [workouts, setWorkouts] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:3000/categories/${userDetails.id}`);
      setCategories(response.data);
    } catch (error) {
      console.log('Error', 'Failed to fetch categories');
    }
  };

  const fetchWorkoutsForCategory = async (categoryId) => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:3000/user-workouts`, { params: { userId: userDetails.id } });
      const categoryWorkouts = response.data.filter(workout => workout.category_id === categoryId);
      setWorkouts(prevWorkouts => ({ ...prevWorkouts, [categoryId]: categoryWorkouts }));
    } catch (error) {
      console.log('Error', 'Failed to fetch workouts for category');
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(`http://${SERVER_IP}:3000/categories`, { name: newCategory, user_id: userDetails.id });
      setCategories([...categories, response.data]);
      setModalVisible(false);
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
      Alert.alert('Error', 'Failed to add category');
    }
  };

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
    if (!expanded[categoryId]) {
      fetchWorkoutsForCategory(categoryId);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, marginBottom: 1 }}>
      <Button title="Add Category" onPress={() => setModalVisible(true)} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <List.Accordion
              title={item.name}
              expanded={expanded[item.id]}
              onPress={() => toggleExpand(item.id)}
              titleStyle={styles.accordionTitle}
              style={styles.accordion}
            >
              {workouts[item.id] && workouts[item.id].map((workout) => (
                <View key={workout.id} style={styles.workoutDetails}>
                  <Text style={styles.detailText}>{workout.name}</Text>
                  <Text style={styles.detailText}>{new Date(workout.date).toLocaleDateString('en-US')}</Text>
                </View>
              ))}
            </List.Accordion>
            <View style={styles.separator} />
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Icon name="close" size={24} color="black" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Category Name"
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <Button title="Add Category" onPress={handleAddCategory} />
        </View>
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
    padding: 40,
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutDetails: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
    width: '100%',
  },
  accordion: {
    backgroundColor: 'white',
  },
});

export default Categories;