import React from "react";
import { StyleSheet, Text } from "react-native";
import Colors from '../../constants/Colors'

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
    color: Colors.gray
  },
});

export default MyAppText;
