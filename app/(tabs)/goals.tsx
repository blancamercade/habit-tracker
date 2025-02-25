import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper";

interface Goal {
  id: string;
  name: string;
  target: number;
  completed: number;
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [goals]);

  // Load goals from AsyncStorage
  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("goals");
      if (storedGoals) setGoals(JSON.parse(storedGoals));
    } catch (error) {
      console.error("Failed to load goals", error);
    }
  };

  // Save goals to AsyncStorage
  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("goals", JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals", error);
    }
  };

  // Add a new goal
  const addGoal = () => {
    if (!newGoalName || !newGoalTarget) return;

    const newGoal: Goal = {
      id: Math.random().toString(),
      name: newGoalName,
      target: parseInt(newGoalTarget),
      completed: 0,
    };

    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setNewGoalName("");
    setNewGoalTarget("");
  };

  // Update goal progress
  const updateProgress = (id: string, amount: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, completed: Math.min(goal.completed + amount, goal.target) }
          : goal
      )
    );
  };

  // Delete a goal
  const deleteGoal = (id: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Goals</Text>

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
      <Button title="Add Goal" onPress={addGoal} />

      {/* List of Goals */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>
              {item.name}: {item.completed}/{item.target}
            </Text>

            {/* Progress Bar */}
            <ProgressBar
              progress={item.completed / item.target}
              color="#1B5E20"
              style={styles.progressBar}
            />

            {/* Input for Progress Update */}
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter progress"
              keyboardType="numeric"
              onSubmitEditing={(event) => {
                const value = parseInt(event.nativeEvent.text) || 0;
                updateProgress(item.id, value);
              }}
            />

            {/* Delete Goal Button */}
            <Pressable style={styles.deleteButton} onPress={() => deleteGoal(item.id)}>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
    fontSize: 16,
  },
  inputSmall: {
    borderBottomWidth: 1,
    width: 80,
    padding: 5,
    fontSize: 16,
    marginTop: 5,
  },
  goalItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#D32F2F",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default GoalsScreen;
