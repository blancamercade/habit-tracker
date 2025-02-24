import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Handle notifications properly
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ✅ Request notification permissions
async function requestPermissions() {
  if (!Device.isDevice) return false;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      Alert.alert("Permission Required", "You need to enable notifications in settings.");
      return false;
    }
  }
  return true;
}

// ✅ Schedule a one-time notification 
async function scheduleNotification(time: Date, message: string) {
  console.log("✅ Attempting to schedule notification...");

  const hasPermission = await requestPermissions();
  if (!hasPermission) return;
  
  const now = new Date();
  let triggerTime = new Date(time);

  console.log(`⏰ Notification scheduled for ${triggerTime.toLocaleString()} (${(triggerTime.getTime() - now.getTime()) / 1000} seconds from now)`);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Reminder",
      body: message || "Time to complete your habit!",
      sound: "default",
    },
    trigger: { date: triggerTime }, // ✅ Use absolute date instead of seconds
  });

  Alert.alert("Reminder Set", `Notification scheduled for ${triggerTime.toLocaleString()}`);
}


// ✅ Test an immediate notification
async function testImmediateNotification() {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  console.log("✅ Sending immediate notification...");

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Immediate Notification",
      body: "This is an instant test!",
      sound: "default",
    },
    trigger: { seconds: 1 }, // ✅ Fires in 1 second
  });

  console.log("🎉 Immediate Notification Sent!");
}

// ✅ Test an scheduled notification
async function scheduleAndCancel() {
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hey!',
    },
    trigger: { seconds: 60, repeats: true },
  });
  await Notifications.cancelScheduledNotificationAsync(identifier);
}

// ✅ Main Component
const RemindersScreen = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  });
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  // ✅ Load stored reminder when screen loads
  useEffect(() => {
    (async () => {
      const storedTime = await AsyncStorage.getItem('reminderTime');
      const storedMessage = await AsyncStorage.getItem('reminderMessage');
      if (storedTime) setTime(new Date(storedTime));
      if (storedMessage) setMessage(storedMessage);
    })();
  }, []);

  // ✅ Save and schedule reminder
  const handleSaveReminder = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a reminder message.");
      return;
    }

    try {
      await AsyncStorage.setItem('reminderTime', time.toISOString());
      await AsyncStorage.setItem('reminderMessage', message);

      await scheduleNotification(time, message);
    } catch (error) {
      Alert.alert('Error', 'Failed to set reminder.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set a Reminder</Text>

      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text style={styles.input}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) {
              // ✅ Preserve today's date, only update the hours and minutes
              const now = new Date(); // ✅ Get current time inside the function
              const newTime = new Date();
              newTime.setHours(selectedTime.getHours());
              newTime.setMinutes(selectedTime.getMinutes());
              newTime.setSeconds(0);
              newTime.setMilliseconds(0);
              // ✅ If the selected time is in the past today, move it to tomorrow
              if (newTime <= now) {
                newTime.setDate(newTime.getDate() + 1);
              }
              setTime(newTime); // ✅ Now `time` contains the correct full date and is in the future
            }
          }}
        />
      )}

      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter reminder message"
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveReminder}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testImmediateNotification}>
        <Text style={styles.buttonText}>Test Notification</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={scheduleAndCancel}>
        <Text style={styles.buttonText}>Test Future Reminder</Text>
      </TouchableOpacity>
      
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#BDBDBD", borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 10, backgroundColor: "#FFFFFF", textAlign: 'center' },
  button: { backgroundColor: "#1B5E20", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default RemindersScreen;
