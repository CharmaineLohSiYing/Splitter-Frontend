import React from "react";
import { View, StyleSheet, Text } from "react-native";

const LabelLeft = (props) => {
  return (
  <View style={{ ...styles.labelLeft, ...props.style }}><Text>{props.label}</Text></View>
  );
};

const styles = StyleSheet.create({
  labelLeft: {
    flex: 1,
    backgroundColor:'yellow'
  },
});

export default LabelLeft;
