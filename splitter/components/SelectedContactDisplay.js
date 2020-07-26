import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Badge } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const SelectedContactDisplay = (props) => {

  const handleSelect = () => {
    props.onPress(props.mobileNumber);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleSelect}>
      <View style={styles.nameContainer}>
        <Text>{props.name}</Text>
        <Badge
          status="success"
          containerStyle={{ position: "absolute", top: -8, right: -8 }}
          value={<Ionicons name="md-close" size={10} color="white" />}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    justifyContent: "center",
  },
  nameContainer: {
    borderWidth: 1,
    height: 30,
    borderColor: "green",
    alignItems: "center",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});

export default SelectedContactDisplay;
