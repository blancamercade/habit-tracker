import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import HomeScreen from './index'; // Home screen
import HistoryScreen from './explore'; // History screen

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Today') {
            iconName = 'checkbox-outline'; // Icon for daily habits
          } else if (route.name === 'Look Back') {
            iconName = 'time-outline'; // Icon for reflecting
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="Look Back" component={HistoryScreen} />
    </Tab.Navigator>
  );
}
