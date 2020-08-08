import React from "react";
import { View, StyleSheet, Text } from "react-native";

const LabelLeft = (props) => {
  return (
  <View style={{ ...styles.labelLeft, ...props.style }}><Text style={styles.labelText}>{props.label}</Text></View>
  );
};

const styles = StyleSheet.create({
  labelLeft: {
    flex: 1,
    padding: 5
  },
  labelText:{
    // fontWeight:'bold'
  }
});

export default LabelLeft;
