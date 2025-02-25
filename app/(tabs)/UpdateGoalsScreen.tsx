import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from "react-native";
import { ProgressBar } from "react-native-paper";
import { Goal, loadGoals, saveGoals, updateProgress } from "./GoalsManager";

export default function UpdateGoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    async function fetchGoals() {
      const loadedGoals = await loadGoals();
      setGoals(loadedGoals);
    }
    fetchGoals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Progress</Text>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>
              {item.name}: {item.completed}/{item.target}
            </Text>

            {/* Progress Bar */}
            <ProgressBar progress={item.completed / item.target} color="#1B5E20" style={styles.progressBar} />

            {/* Input for Progress Update */}
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter progress"
              keyboardType="numeric"
              onSubmitEditing={(event) => {
                const value = parseInt(event.nativeEvent.text) || 0;
                updateProgress(item.id, value, goals, setGoals);
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputSmall: {
    borderBottomWidth: 1,
    width: 80,
    padding: 5,
    marginTop: 5,
  },
  goalItem: {
    marginVertical: 10,
    padding: 10,
  },
  progressBar: {
    height: 10,
    marginVertical: 5,
  },
});
