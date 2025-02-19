import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, StyleSheet } from 'react-native';
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
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  await Notifications.cancelAllScheduledNotificationsAsync(); // Clear previous reminders

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Reminder",
      body: message,
      sound: true,
    },
    trigger: {
      hour: time.getHours(),
      minute: time.getMinutes(),
      repeats: true,
    },
  });

  Alert.alert("Reminder Set", `Your reminder is set for ${time.toLocaleTimeString()}`);
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
      <Text style={styles.title}>Set Reminder Time:</Text>
      <Button title={time.toLocaleTimeString()} onPress={() => setShowPicker(true)} />
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

      <Text style={styles.title}>Reminder Message:</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter reminder message"
      />

      <Button title="Save Reminder" onPress={handleSaveReminder} />
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: '#ccc',
  },
});

export default RemindersScreen;
