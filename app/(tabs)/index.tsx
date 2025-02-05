import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function App() {
  // List of your habits
  const [habits, setHabits] = useState([
    { id: '1', name: 'Drink 1.5L of water' },
    { id: '2', name: 'Exercise' },
    { id: '3', name: 'Take protein drink' },
    { id: '4', name: 'Complete 1 meaningful work task' },
    { id: '5', name: 'Stretch' },
    { id: '6', name: 'Quality time with kids or Colin' },
    { id: '7', name: 'Read' },
    { id: '8', name: 'Sleep by 10:30 PM' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Habit Tracker</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.habitItem}>
            <Text style={styles.habitText}>{item.name}</Text>
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
  },
  habitText: {
    fontSize: 18,
  },
});
