import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // List of habits with a "completed" status
  const [habits, setHabits] = useState([
    { id: '1', name: 'Drink 1.5L of water', completed: false },
    { id: '2', name: 'Exercise', completed: false },
    { id: '3', name: 'Take protein drink', completed: false },
    { id: '4', name: 'Complete 1 meaningful work task', completed: false },
    { id: '5', name: 'Stretch', completed: false },
    { id: '6', name: 'Quality time with kids or Colin', completed: false },
    { id: '7', name: 'Read', completed: false },
    { id: '8', name: 'Sleep by 10:30 PM', completed: false },
  ]);

  // Load habits from storage when the app starts
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) {
          setHabits(JSON.parse(storedHabits));
        }
      } catch (error) {
        console.error('Failed to load habits:', error);
      }
    };
    loadHabits();
  }, []);

  // Save habits whenever they change
  useEffect(() => {
    const saveHabits = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits:', error);
      }
    };
    saveHabits();
  }, [habits]);

  // Function to toggle habit completion
  const toggleHabit = (id: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habit Tracker</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.habitItem, item.completed && styles.habitCompleted]}
            onPress={() => toggleHabit(item.id)}
          >
            <Text style={[styles.habitText, item.completed && styles.habitTextCompleted]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  habitItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    width: 300,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  habitCompleted: {
    backgroundColor: '#c8e6c9',
  },
  habitText: {
    fontSize: 18,
  },
  habitTextCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
