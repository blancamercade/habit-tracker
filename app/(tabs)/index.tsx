import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const defaultHabits = [
    { id: '1', name: 'Drink 1.5L of water', completed: false, streak: 0 },
    { id: '2', name: 'Exercise', completed: false, streak: 0 },
    { id: '3', name: 'Take protein drink', completed: false, streak: 0 },
    { id: '4', name: 'Complete 1 meaningful work task', completed: false, streak: 0 },
    { id: '5', name: 'Stretch', completed: false, streak: 0 },
    { id: '6', name: 'Quality time with kids or Colin', completed: false, streak: 0 },
    { id: '7', name: 'Read', completed: false, streak: 0 },
    { id: '8', name: 'Sleep by 10:30 PM', completed: false, streak: 0 },
  ];

  const [habits, setHabits] = useState(defaultHabits);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        if (storedHabits) setHabits(JSON.parse(storedHabits));
      } catch (error) {
        console.error('Failed to load habits:', error);
      }
    };
    loadData();
  }, []);

  const toggleHabit = (id: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habit Tracker</Text>
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.habitItem, item.completed && styles.habitCompleted]}
            onPress={() => toggleHabit(item.id)}
          >
            <Text style={[styles.habitText, item.completed && styles.habitTextCompleted]}>
              {item.name} ({item.streak}🔥)
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
