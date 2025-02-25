import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

export default function GoalsScreen() {
  const [goals, setGoals] = useState([
    { id: '1', name: 'Push-ups', target: 3000, completed: 1200 },
    { id: '2', name: 'Reading', target: 100, completed: 40 },
  ]);

  const updateProgress = (id, amount) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? { ...goal, completed: Math.min(goal.completed + amount, goal.target) }
          : goal
      )
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name}: {item.completed}/{item.target}</Text>
            <TextInput
              placeholder="Enter progress"
              keyboardType="numeric"
              onSubmitEditing={(event) => {
                const value = parseInt(event.nativeEvent.text) || 0;
                updateProgress(item.id, value);
              }}
              style={{
                borderBottomWidth: 1,
                padding: 5,
                marginVertical: 5,
                width: 100,
              }}
            />
          </View>
        )}
      />
    </View>
  );
}
