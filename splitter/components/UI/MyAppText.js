import React from "react";
import { StyleSheet, Text } from "react-native";

const MyAppText = (props) => {
  return (
    <Text style={{...styles.text, ...props.style}}>
        {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily:'roboto-medium',
    color: '#535353'
  },
});

export default MyAppText;
