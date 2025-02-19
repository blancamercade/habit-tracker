import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Request notification permissions
async function requestPermissions() {
  if (Device.isDevice) {
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
  return false;
}

// Schedule Notification
async function scheduleNotification(time: Date, message: string) {
  console.log("✅ Attempting to schedule notification...");

  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.log("❌ Notification permission denied.");
    return;
  }

  console.log("🔄 Canceling existing notifications...");
  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger = new Date(time);
  trigger.setSeconds(0); // Ensure it triggers exactly at the minute

  console.log(`⏰ Scheduling for: ${trigger.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Reminder",
      body: message,
      sound: "default",
    },
    trigger: { 
      seconds: (trigger.getTime() - Date.now()) / 1000, // Schedule based on actual timestamp
    },
  });

  Alert.alert("Reminder Set", `A notification has been set up for ${trigger.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} every day.`);
  console.log("🎉 Scheduled Notification Successfully!");
}

// Test immediate notification
async function testImmediateNotification() {
  const { status } = await Notifications.getPermissionsAsync();
  console.log("🔍 Notification Permission Status:", status);

  if (status !== 'granted') {
    Alert.alert("Notification Permission Denied", "Please enable notifications in settings.");
    return;
  }

  console.log("✅ Permission granted. Sending immediate notification...");

  await Notifications.presentNotificationAsync({
    content: {
      title: "Immediate Notification",
      body: "This is an instant test!",
      sound: "default",
    },
  });

  console.log("🎉 Immediate Notification Sent!");
}

const RemindersScreen = () => {
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      const storedTime = await AsyncStorage.getItem('reminderTime');
      const storedMessage = await AsyncStorage.getItem('reminderMessage');
      if (storedTime) setTime(new Date(storedTime));
      if (storedMessage) setMessage(storedMessage);
    })();
  }, []);

  useEffect(() => {
    async function checkPermissions() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        Alert.alert('Permission Status', `New Status: ${newStatus}`);
      } else {
        Alert.alert('Permission Status', 'Notifications are already enabled');
      }
    }

    checkPermissions();
  }, []);

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
      <Button title={time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onPress={() => setShowPicker(true)} style={styles.input}/>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}
      
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter reminder message"
      />

      <TouchableOpacity style={styles.savereminderButton} onPress={handleSaveReminder}>
        <Text style={styles.savereminderButtonText}>Set reminder</Text>
      </TouchableOpacity>
      
      <Button title="Test Notification" onPress={testImmediateNotification} color="#1B5E20" marginBottom="10" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  savereminderButton: {
    backgroundColor: "#1B5E20",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  savereminderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RemindersScreen;
