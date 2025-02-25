import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";

import HomeScreen from "./index"; // Home screen
import HistoryScreen from "./explore"; // History screen
import SetHabitsScreen from "./sethabits"; // Habit settings
import SetObjectivesScreen from "./setobjectives"; // Objectives settings
import SetGoalsScreen from "./SetGoalsScreen"; // New screen for setting goals
import UpdateGoalsScreen from "./UpdateGoalsScreen"; // New screen for updating progress

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1B5E20", // ✅ Dark Green when selected
        tabBarInactiveTintColor: "#757575", // ✅ Gray when not selected
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Habits") {
            iconName = "checkbox-outline"; // ✅ Daily habits
          } else if (route.name === "Goals") {
            iconName = "trophy-outline"; // ✅ Track Goals
          } else if (route.name === "Look Back") {
            iconName = "time-outline"; // ✅ History screen
          }  else if (route.name === "Set Objectives") {
            iconName = "settings-outline";} // ✅ Set goals and habits

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Habits" component={HomeScreen} />
      <Tab.Screen name="Goals" component={UpdateGoalsScreen} />
      <Tab.Screen name="Look Back" component={HistoryScreen} />
      <Tab.Screen name="Set Objectives" component={SetObjectivesScreen} />
    </Tab.Navigator>
  );
}
