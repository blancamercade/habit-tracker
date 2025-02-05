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
  const [lastResetDate, setLastResetDate] = useState('');

  // Load habits and last reset date
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem('habits');
        const storedDate = await AsyncStorage.getItem('lastResetDate');
        if (storedHabits) setHabits(JSON.parse(storedHabits));
        if (storedDate) setLastResetDate(storedDate);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // Save habits when they change
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('habits', JSON.stringify(habits));
      } catch (error) {
        console.error('Failed to save habits:', error);
      }
    };
    saveData();
  }, [habits]);

  // Reset and save history at midnight
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastResetDate !== today) {
      const completedHabits = habits.filter(habit => habit.completed).map(habit => habit.name);
      
      if (completedHabits.length > 0) {
        const saveHistory = async () => {
          try {
            const history = await AsyncStorage.getItem('habitHistory');
            const historyArray = history ? JSON.parse(history) : [];
            historyArray.unshift({ date: lastResetDate, completed: completedHabits });
            await AsyncStorage.setItem('habitHistory', JSON.stringify(historyArray));
          } catch (error) {
            console.error('Failed to save history:', error);
          }
        };
        saveHistory();
      }

      // Reset habits for the new day
      const updatedHabits = habits.map(habit => ({
        ...habit,
        streak: habit.completed ? habit.streak + 1 : 0,
        completed: false,
      }));
      setHabits(updatedHabits);
      setLastResetDate(today);
      AsyncStorage.setItem('lastResetDate', today);
    }
  }, [lastResetDate]);

  // Toggle habit completion
  const toggleHabit = (id: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  return (
    <View style={styles.container}>
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
