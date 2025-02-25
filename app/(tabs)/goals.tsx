import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import date picker

interface Goal {
  id: string;
  name: string;
  target: number;
  completed: number;
  deadline: string; // Add deadline field
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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
  const saveGoals = async (goalsToSave = goals) => {
    try {
      await AsyncStorage.setItem("goals", JSON.stringify(goalsToSave));
    } catch (error) {
      console.error("Failed to save goals", error);
    }
  };

  // Add a new goal
  const addGoal = () => {
    if (!newGoalName || !newGoalTarget || !newGoalDeadline) return;

    const newGoal: Goal = {
      id: Math.random().toString(),
      name: newGoalName,
      target: parseInt(newGoalTarget),
      completed: 0,
      deadline: newGoalDeadline.toISOString().split("T")[0], // Store as YYYY-MM-DD
    };

    setGoals((prevGoals) => [...prevGoals, newGoal]);
    setNewGoalName("");
    setNewGoalTarget("");
    setNewGoalDeadline(null);
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

    {/* List of Goals */}
    <FlatList
      data={goals}
      keyExtractor={(item) => item.id}
      keyboardShouldPersistTaps="handled" // ✅ Ensures buttons work after input
      renderItem={({ item }) => {
        const [progressInput, setProgressInput] = useState(""); // ✅ Local state

        return (
          <View style={styles.goalItem}>
            {/* Goal title row */}
            <View style={styles.goalTitleItem}>
              <Text style={styles.goalTitleText}>
                {item.name}: {item.completed}/{item.target}
              </Text>
              {/* Delete Goal Button */}
              <TouchableOpacity onPress={() => deleteGoal(item.id)}>
                <Text style={styles.deleteText}>❌</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <ProgressBar progress={item.completed / item.target} color="#1B5E20" style={styles.progressBar} />

            {/* Deadline */}
            <Text style={styles.goalTitleText}>By {item.deadline}</Text>

            {/* Enter Progress */}
            <View style={styles.progressInputContainer}>
              <TextInput
                style={styles.inputSmall} // ✅ Reduced size for better UX
                placeholder="Enter progress"
                keyboardType="numeric"
                value={progressInput}
                onChangeText={setProgressInput} // ✅ Local state before submit
                onSubmitEditing={() => {
                  const value = parseInt(progressInput) || 0;
                  updateProgress(item.id, value);
                  setProgressInput(""); // ✅ Clear input after updating
                }}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  const value = parseInt(progressInput) || 0;
                  updateProgress(item.id, value);
                  setProgressInput("");
                }}
              >
                <Text style={styles.submitText}>✔</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }}
    />

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

    {/* Date Picker for Deadline */}
    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
      <Text style={styles.inputText}>
        {newGoalDeadline ? newGoalDeadline.toDateString() : "Select Deadline"}
      </Text>
    </TouchableOpacity>

    {showDatePicker && (
      <DateTimePicker
        value={newGoalDeadline || new Date()}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) setNewGoalDeadline(selectedDate);
        }}
      />
    )}

    {/* Add Goal Button */}
    <TouchableOpacity style={styles.addGoal} onPress={addGoal}>
      <Text style={styles.addGoalText}>+ Add Goal</Text>
    </TouchableOpacity>
  </View>
);

}
// Styles
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
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  inputText: {
    fontSize: 16,
    color: "#000000",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  goalItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  goalTitleItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitleText: {
    fontSize: 18,
  },
  addGoal: {
    backgroundColor: "#1B5E20",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addGoalText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteText: {
    fontSize: 16,
    color: "red",
  },
  progressInputContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 5,
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    width: 80,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#1B5E20",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
