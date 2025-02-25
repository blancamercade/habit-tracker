import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Pressable } from "react-native";
import { ProgressBar } from "react-native-paper";
import { Goal, loadGoals, saveGoals, updateProgress } from "./GoalsManager";
import styles from "./styles";  // ✅ Import shared styles


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
            <Text style={styles.habitText}>
              {item.name}: {item.completed}/{item.target}
            </Text>

            {/* Progress Bar */}
            <ProgressBar progress={item.completed / item.target} color="#1B5E20" style={styles.progressBar} />

            {/* Input for Progress Update */}
            <TextInput
              style={styles.input}
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
