import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const defaultHabits = [
    { id: '1', name: 'Drink 1.5L of water', completed: false, streak: 0 },
    { id: '2', name: 'Exercise', completed: false, streak: 0 },
    { id: '3', name: 'Protein drink', completed: false, streak: 0 },
    { id: '4', name: 'Meaningful work', completed: false, streak: 0 },
    { id: '5', name: 'Stretch', completed: false, streak: 0 },
    { id: '6', name: 'Quality time', completed: false, streak: 0 },
    { id: '7', name: 'Read', completed: false, streak: 0 },
    { id: '8', name: 'Sleep 22:30', completed: false, streak: 0 },
  ];

  const [habits, setHabits] = useState(defaultHabits);
  const [lastResetDate, setLastResetDate] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const storedHabits = await AsyncStorage.getItem('habits');
          if (storedHabits) setHabits(JSON.parse(storedHabits));
        } catch (error) {
          console.error("Failed to load habits:", error);
        }
      };
      loadData();
    }, [setHabits])
  );

  const toggleHabit = async (id: string) => {
    setHabits(prevHabits => {
      const updatedHabits = prevHabits.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      );
      AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
      return updatedHabits;
    });
  };

  const logAndResetHabits = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get completed habits
      const completedHabits = habits.filter(habit => habit.completed).map(habit => habit.name);

      if (completedHabits.length > 0) {
        let history = await AsyncStorage.getItem('habitHistory');
        history = history ? JSON.parse(history) : [];

        history.unshift({ date: today, completed: completedHabits });
        await AsyncStorage.setItem('habitHistory', JSON.stringify(history));
      }

      // Reset habits
      const updatedHabits = habits.map(habit => ({
        ...habit,
        streak: habit.completed ? habit.streak + 1 : 0,
        completed: false,
      }));

      setHabits(updatedHabits);
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));

      setLastResetDate(today);
      await AsyncStorage.setItem('lastResetDate', today);

      alert("✅ Habits logged and reset for tomorrow!");
    } catch (error) {
      console.error("❌ Error logging and resetting habits:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Habits</Text>
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
      <TouchableOpacity style={styles.logResetButton} onPress={logAndResetHabits}>
        <Text style={styles.logResetButtonText}>Log & Reset for Tomorrow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA', // Light teal background
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B', // Dark teal
    marginBottom: 20,
  },
  habitItem: {
    backgroundColor: '#FFF9C4', // Pastel yellow for pending tasks
    padding: 15,
    marginVertical: 5,
    width: 320,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  habitCompleted: {
    backgroundColor: '#FFAB91', // Soft orange for completed tasks
  },
  habitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F', // Dark gray
  },
  habitTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#616161', // Lighter gray for completed
  },
  logResetButton: {
    backgroundColor: "#FF7043", // Coral pink
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  logResetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

