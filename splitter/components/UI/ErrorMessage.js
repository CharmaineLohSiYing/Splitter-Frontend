import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const ErrorMessage = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <Ionicons name="md-person" size={22} color={Colors.red1} />
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.red3,
  },
  text: {
    marginLeft: 10,
    color: Colors.red1,
    fontSize: 12,
  },
});

export default ErrorMessage;
