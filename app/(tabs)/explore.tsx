import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]); // Ensures history is always an array

  useFocusEffect(
  React.useCallback(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('habitHistory');
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      } catch (error) {
        console.error("Error loading history:", error);
      }
     };
     loadHistory();
    }, [])
  );

  // Function to reset history
  const resetHistory = async () => {
    try {
      // Clear history
      await AsyncStorage.removeItem('habitHistory');
      setHistory([]); // Clear UI history
      // Load current habits from storage
      let storedHabits = await AsyncStorage.getItem('habits');
      let resetHabits = storedHabits ? JSON.parse(storedHabits) : [];
      // Reset all streaks and mark as incomplete
      resetHabits = resetHabits.map(habit => ({
        ...habit,
        completed: false,
        streak: 0,
      }));
      // Save reset habits back to AsyncStorage
      await AsyncStorage.setItem('habits', JSON.stringify(resetHabits));
      // Clear reset date
      await AsyncStorage.removeItem('lastResetDate');
      alert("📖 Habit history and streaks have been reset!");
    } catch (error) {
      console.error("❌ Error resetting history and streaks:", error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit History</Text>
      
      {history.length === 0 ? (
        <Text style={styles.noHistory}>No history recorded yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.date}>{item.date}</Text>
              {item.completed.map((habit, index) => (
                <Text key={index} style={styles.habit}>{habit}</Text>
              ))}
            </View>
          )}
        />
      )}
      {/* Button to clear history data */}
      <TouchableOpacity style={styles.resetButton} onPress={resetHistory}>
        <Text style={styles.resetButtonText}>Reset history</Text>
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
  noHistory: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    padding: 15,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  habit: {
    fontSize: 14,
    color: 'gray',
  },
  resetButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
