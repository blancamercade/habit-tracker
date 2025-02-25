import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Goal, loadGoals, saveGoals, addGoal, deleteGoal } from "./GoalsManager";
import styles from "./styles";  // ✅ Import shared styles


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
      
      <TouchableOpacity style={styles.GreenButton} onPress={() => addGoal(goals, newGoalName, newGoalTarget, setGoals)}>
        <Text style={styles.GreenButtonText}>+ Add Goal</Text>
      </TouchableOpacity>
      
      {/* List of Goals */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitItem}>
            <Text style={styles.habitText}>
              {item.name}: {item.target}
            </Text>

            {/* Delete Goal Button */}
            <TouchableOpacity onPress={() => deleteGoal(item.id, goals, setGoals)}>
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
