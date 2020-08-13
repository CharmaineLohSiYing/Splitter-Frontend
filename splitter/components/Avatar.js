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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const Avatar = (props) => {
  const size = {}
  if (props.height){
    size.height = props.height
    size.width = props.height
    size.borderRadius = props.height / 2
  }
  return (
      <View style={[styles.avatar, props.height ? size : {}]}>
        {props.numExcess ? <Text style={styles.numExcess}>+{props.numExcess}</Text>:<Ionicons name="md-person" size={18} color="white" />}
      </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  numExcess:{
    fontSize:12
  }
});

export default Avatar;
