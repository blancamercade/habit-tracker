import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Request notification permissions
async function requestPermissions() {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Enable notifications in settings.');
    }
  }
}

// Schedule Notification
async function scheduleNotification(time: Date, message: string) {
  const trigger = new Date(time);
  trigger.setSeconds(0); // Ensure it triggers exactly at the minute

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Reminder",
      body: message,
      sound: "default",
    },
    trigger: { 
      hour: trigger.getHours(), 
      minute: trigger.getMinutes(), 
      repeats: true 
    },
  });
}

const RemindersScreen = () => {
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState('Don\'t forget to track your habits!');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    requestPermissions(); // Ask for notification permissions on mount
  }, []);

  const handleSaveReminder = async () => {
    try {
      await AsyncStorage.setItem('reminderTime', time.toISOString());
      await AsyncStorage.setItem('reminderMessage', message);

      await scheduleNotification(time, message);
      Alert.alert('Success', 'Reminder scheduled!');
    } catch (error) {
      Alert.alert('Error', 'Failed to set reminder.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Set Reminder Time:</Text>
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

      <Text style={{ fontSize: 18, marginTop: 20 }}>Reminder Message:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 10, marginTop: 10, borderRadius: 5 }}
        value={message}
        onChangeText={setMessage}
      />

      <Button title="Save Reminder" onPress={handleSaveReminder} style={{ marginTop: 20 }} />
    </View>
  );
};

export default RemindersScreen;
