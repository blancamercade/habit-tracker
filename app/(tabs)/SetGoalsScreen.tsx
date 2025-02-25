import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable } from "react-native";
import { Goal, loadGoals, saveGoals, addGoal, deleteGoal } from "./GoalsManager";

export default function SetGoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");

  useEffect(() => {
    async function fetchGoals() {
      const loadedGoals = await loadGoals();
      setGoals(loadedGoals);
    }
    fetchGoals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Goals</Text>

      {/* Input Fields to Add a Goal */}
      <TextInput
        style={styles.input}
        placeholder="Goal name (e.g., Push-ups)"
        value={newGoalName}
        onChangeText={setNewGoalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Target (e.g., 3000)"
        value={newGoalTarget}
        onChangeText={setNewGoalTarget}
        keyboardType="numeric"
      />
      <Button title="Add Goal" onPress={() => addGoal(goals, newGoalName, newGoalTarget, setGoals)} />

      {/* List of Goals */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>
              {item.name}: {item.target}
            </Text>

            {/* Delete Goal Button */}
            <Pressable style={styles.deleteButton} onPress={() => deleteGoal(item.id, goals, setGoals)}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
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
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  goalItem: {
    marginVertical: 10,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
  },
  deleteText: {
    color: "white",
  },
});
