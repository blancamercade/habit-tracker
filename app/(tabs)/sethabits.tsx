import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";  // ✅ Import shared styles


export default function SetHabitsScreen() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const storedHabits = await AsyncStorage.getItem("habits");
        if (storedHabits) setHabits(JSON.parse(storedHabits));
      } catch (error) {
        console.error("Failed to load habits:", error);
      }
    };
    loadHabits();
  }, []);

  const addHabit = () => {
    if (newHabit.trim() === "") return;
    const updatedHabits = [
      ...habits,
      { id: Date.now().toString(), name: newHabit, completed: false, streak: 0 },
    ];
    setHabits(updatedHabits);
    AsyncStorage.setItem("habits", JSON.stringify(updatedHabits));
    setNewHabit("");
  };

  const deleteHabit = (id) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
    AsyncStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Your Habits</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitItem}>
            <Text style={styles.habitText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteHabit(item.id)}>
              <Text style={styles.deleteText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Add new habit"
        value={newHabit}
        onChangeText={setNewHabit}
      />
      <TouchableOpacity style={styles.GreenButton} onPress={addHabit}>
        <Text style={styles.GreenButtonText}>+ Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
}
