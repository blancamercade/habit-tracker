import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProgressBar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

interface Goal {
  id: string;
  name: string;
  target: number;
  completed: number;
  deadline: string;
}

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ✅ Store inputs in ref to avoid re-renders
  const progressInputsRef = useRef<{ [key: string]: string }>({});

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [goals]);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("goals");
      if (storedGoals) setGoals(JSON.parse(storedGoals));
    } catch (error) {
      console.error("Failed to load goals", error);
    }
  };

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem("goals", JSON.stringify(goals));
    } catch (error) {
      console.error("Failed to save goals", error);
    }
  };

  const handleProgressInputChange = (id: string, value: string) => {
    progressInputsRef.current[id] = value; // ✅ Uses ref to avoid re-renders
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Goals</Text>

          <FlatList
            data={goals}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => (
              <GoalItem
                item={item}
                progressInput={progressInputsRef.current[item.id] || ""}
                onProgressChange={handleProgressInputChange}
                onUpdateProgress={() => {}}
                onDeleteGoal={() => {}}
              />
            )}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const GoalItem = ({ item, progressInput, onProgressChange }) => {
  return (
    <View style={styles.goalItem}>
      <Text>{item.name}</Text>
      <TextInput
        style={styles.input}
        value={progressInput}
        onChangeText={(value) => onProgressChange(item.id, value)}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, textAlign: "center" },
  input: { borderWidth: 1, padding: 8, marginVertical: 5 },
  goalItem: { marginBottom: 10, padding: 10, backgroundColor: "#fff" }
});
