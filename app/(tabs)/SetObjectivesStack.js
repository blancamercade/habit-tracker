import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SetObjectivesScreen from "./setobjectives"; // Main Set Objectives screen
import SetHabitsScreen from "./sethabits"; // Hidden Habits settings screen
import SetGoalsScreen from "./SetGoalsScreen"; // Hidden Goals settings screen

const Stack = createStackNavigator();

const SetObjectivesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SetObjectivesMain" component={SetObjectivesScreen} />
      <Stack.Screen name="SetHabits" component={SetHabitsScreen} />
      <Stack.Screen name="SetGoals" component={SetGoalsScreen} />
    </Stack.Navigator>
  );
};

export default SetObjectivesStack;
