import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable, TouchableOpacity, } from "react-native";
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
  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("goals", JSON.stringify(goals));
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

      <Button title="Add Goal" onPress={addGoal} />

      {/* List of Goals */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}> // Goal item
            
            //Goal title
            <View style={styles.goalTitleItem}> // Goal item
              <Text style={styles.goalTitleText}> {item.name}: {item.completed}/{item.target} </Text> //Goal title
              {/* Delete Goal Button */}
              <TouchableOpacity onPress={() => deleteGoal(item.id)}>
                <Text style={styles.deleteText}>❌</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.deadlineText}>Deadline: {item.deadline}</Text> //Goal deadline
            <ProgressBar progress={item.completed / item.target} color="#1B5E20" style={styles.progressBar} /> //Progress bar
            <TextInput
              style={styles.inputSmall}
              placeholder="Enter progress"
              keyboardType="numeric"
              onSubmitEditing={(event) => {
                const value = parseInt(event.nativeEvent.text) || 0;
                updateProgress(item.id, value);
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
    color: "#000000", // Ensure text is visible
  },
  inputSmall: {
    borderBottomWidth: 1,
    width: 80,
    padding: 5,
    fontSize: 16,
    marginTop: 5,
  },
  dateButton: {
    backgroundColor: "#1976D2",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  dateButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  goalItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  goalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  deadlineText: {
    fontSize: 14,
    color: "#D32F2F",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  goalTitleItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",  // Align items horizontally
    justifyContent: "space-between", // Push items to the edges
    alignItems: "center", // Align vertically in the center
  },
  goalTitleText: {
    fontSize: 18,
  },
});

export default GoalsScreen;
