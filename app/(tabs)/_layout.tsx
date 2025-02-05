import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './index'; // Home screen
import HistoryScreen from './explore'; // History screen

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}
