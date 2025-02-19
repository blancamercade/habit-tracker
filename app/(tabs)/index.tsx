import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
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
  
   const debugStorage = async () => {
      try {
        const history = await AsyncStorage.getItem('habitHistory');
        console.log("Habit History:", history ? JSON.parse(history) : "No history found");
    
        const lastReset = await AsyncStorage.getItem('lastResetDate');
        console.log("Last Reset Date:", lastReset || "Not set");
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };
  
    debugStorage();

const toggleHabit = async (id: string) => {
  setHabits(prevHabits => {
    const updatedHabits = prevHabits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    // ✅ Save updated habits immediately to AsyncStorage
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
      // Load existing history
      let history = await AsyncStorage.getItem('habitHistory');
      history = history ? JSON.parse(history) : [];

      // Add new history entry
      history.unshift({ date: today, completed: completedHabits });

      // Save updated history
      await AsyncStorage.setItem('habitHistory', JSON.stringify(history));
    }

    // Reset habits for the new day
    const updatedHabits = habits.map(habit => ({
      ...habit,
      streak: habit.completed ? habit.streak + 1 : 0,
      completed: false,
    }));

    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));

    // Save new reset date
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
      <TouchableOpacity style={styles.logButton} onPress={logAndResetHabits}>
        <Text style={styles.logButtonText}>Log & Reset for tomorrow</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  habitItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
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
  logButton: {
    backgroundColor: "#1B5E20",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
