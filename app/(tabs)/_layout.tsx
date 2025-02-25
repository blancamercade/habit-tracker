import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import HomeScreen from './index'; // Home screen
import HistoryScreen from './explore'; // History screen
import SetHabitsScreen from './sethabits'; // New Set Habits screen
import GoalsScreen from './goals';  // Import the new goals screen

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

          if (route.name === 'Today') {
            iconName = 'checkbox-outline'; // Icon for daily habits
          } else if (route.name === 'Goals') {
            iconName = 'settings-outline'; // Icon for setting goals
          } else if (route.name === 'Look Back') {
            iconName = 'time-outline'; // Icon for reflecting
          } else if (route.name === 'Set Habits') {
            iconName = 'trophy-outline'; // Icon for setting habits
          } 

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
      <Tab.Screen name="Look Back" component={HistoryScreen} />
      <Tab.Screen name="Set Habits" component={SetHabitsScreen} />
    </Tab.Navigator>
  );
}
