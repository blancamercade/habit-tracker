import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Define the bottom tab navigator
const Tab = createBottomTabNavigator();

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

// 📌 Home Screen - Displays current habits
function HomeScreen() {
  const [habits, setHabits] = useState(defaultHabits);
  const [lastResetDate, setLastResetDate] = useState('');

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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastResetDate !== today) {
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

// 📌 History Screen - Placeholder for now
function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit History (Coming Soon!)</Text>
    </View>
  );
}

// 📌 Main App - Includes Bottom Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// 📌 Styles
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
