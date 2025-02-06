import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Button, Alert } from 'react-native';
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
  
  // Test entry
  const addTestHistory = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const testEntry = { date: today, completed: ["Test Habit 1", "Test Habit 2"] };

    // Load existing history
    let history = await AsyncStorage.getItem('habitHistory');
    history = history ? JSON.parse(history) : [];

    // Add new test entry
    history.unshift(testEntry);
    await AsyncStorage.setItem('habitHistory', JSON.stringify(history));

    Alert.alert("Test Entry Added", "Check Look Back to see if history updates!");
  } catch (error) {
    console.error("Error adding test history:", error);
  }
};

  // Debugging function to manually check AsyncStorage
  const debugHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('habitHistory');
      Alert.alert(
        "Habit History Debug",
        `History Data: ${storedHistory || 'No history found'}`
      );
    } catch (error) {
      console.error('Error retrieving history:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      {/* Debug Button to Check History Data */}
      <Button title="Debug History" onPress={debugHistory} />
      {/* Test entry */}
      <Button title="Add Test History" onPress={addTestHistory} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
});
