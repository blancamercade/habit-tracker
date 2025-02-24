import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Request notification permissions
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

// ✅ Sets up a notification channel on Android
async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    console.log("🔍 Fetching existing notification channels...");
    const existingChannels = await Notifications.getNotificationChannelsAsync();
    console.log("📢 Before Setup - Available Notification Channels:", existingChannels);

    await Notifications.setNotificationChannelAsync('habit-reminders', {
      name: 'Habit Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      enableVibrate: true,
    });

    const updatedChannels = await Notifications.getNotificationChannelsAsync();
    console.log("📢 After Setup - Available Notification Channels:", updatedChannels);
  }
}

// ✅ Schedule Daily Reminder Notification
async function scheduleNotification(time: Date, message: string) {
  console.log("✅ Attempting to schedule notification...");

  // ✅ Ensure the notification channel is set up
  await setupNotificationChannel();

  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.log("❌ Notification permission denied.");
    return;
  }

  console.log("🔄 Canceling existing notifications...");
  await Notifications.cancelAllScheduledNotificationsAsync();

  const trigger = {
    hour: time.getHours(),
    minute: time.getMinutes(),
    repeats: true, // ✅ Ensures daily repetition
  };

  console.log(`⏰ Scheduling for: ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit Reminder",
      body: message || "Time to complete your habit!",
      sound: "default",
      android: {
        channelId: 'habit-reminders', // ✅ Ensures notification uses the correct channel
      },
    },
    trigger,
  });

  // ✅ Debugging: Log scheduled notifications
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log("📋 Scheduled Notifications:", scheduledNotifications);

  Alert.alert("Reminder Set", `Your reminder is set for ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} every day.`);
}

// ✅ Test Immediate Notification
async function testImmediateNotification() {
  await setupNotificationChannel(); // ✅ Ensure the channel is set

  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    return;
  }

  console.log("✅ Sending immediate notification...");

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Immediate Notification",
      body: "This is an instant test!",
      sound: "default",
      android: {
        channelId: 'habit-reminders', // ✅ Force usage of the correct channel
      },
    },
    trigger: { seconds: 1 }, // ✅ Fire in 1 second
  });

  // ✅ Check if the notification is scheduled correctly
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  console.log("📋 Scheduled Notifications After Test:", scheduledNotifications);

  console.log("🎉 Immediate Notification Sent!");
}


// ✅ Main Component
const RemindersScreen = () => {
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  // ✅ Load stored reminder when the screen loads
  useEffect(() => {
    setupNotificationChannel(); // ✅ Ensure channel is set before scheduling notifications

    (async () => {
      const storedTime = await AsyncStorage.getItem('reminderTime');
      const storedMessage = await AsyncStorage.getItem('reminderMessage');
      if (storedTime) setTime(new Date(storedTime));
      if (storedMessage) setMessage(storedMessage);
    })();

    // ✅ Set up notification listeners (runs once)
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log("📩 Notification received:", notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("🎯 Notification clicked:", response);
    });

    // ✅ Cleanup listeners when the component unmounts
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
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
        <Text style={styles.savereminderButtonText}>Set Reminder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.savereminderButton} onPress={testImmediateNotification}>
        <Text style={styles.savereminderButtonText}>Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#BDBDBD", borderRadius: 10, padding: 10, fontSize: 16, marginBottom: 10, backgroundColor: "#FFFFFF", textAlign: 'center' },
  savereminderButton: { backgroundColor: "#1B5E20", padding: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  savereminderButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default RemindersScreen;
