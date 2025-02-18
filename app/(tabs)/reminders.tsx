import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RemindersScreen = () => {
  const [time, setTime] = useState(new Date());
  const [message, setMessage] = useState('Don\'t forget to track your habits!');
  const [showPicker, setShowPicker] = useState(false);

  const handleSaveReminder = async () => {
    try {
      await AsyncStorage.setItem('reminderTime', time.toISOString());
      await AsyncStorage.setItem('reminderMessage', message);
      Alert.alert('Success', 'Reminder saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the reminder.');
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
