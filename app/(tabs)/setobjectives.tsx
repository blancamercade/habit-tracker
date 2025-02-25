import React from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";  // ✅ Import shared styles

const SetObjectivesScreen = () => {
  const navigation = useNavigation(); // ✅ Get navigation prop

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Define Your Objectives</Text>

      {/* Edit your daily habits */}
      <TouchableOpacity style={styles.GreenButton} onPress={() => navigation.navigate("SetHabitsScreen")}>
        <Text style={styles.GreenButtonText}>Edit your daily habits</Text>
      </TouchableOpacity>

      {/* Edit your daily habits */}
      <TouchableOpacity style={styles.GreenButton} onPress={() => navigation.navigate("SetGoalsScreen")}>
        <Text style={styles.GreenButtonText}>Set your larger goals</Text>
      </TouchableOpacity>
      
      
    </View>
  );
}

export default SetObjectivesScreen;
