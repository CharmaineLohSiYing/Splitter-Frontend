import React from "react";
import { View } from "react-native";
import GlobalStyles from "../../assets/style"

const FlatListLineSeparator = (props) => {
  return (
    <View style={{ ...GlobalStyles.flatListLineSeparator, ...props.style }}/>
  );
};


export default FlatListLineSeparator;
