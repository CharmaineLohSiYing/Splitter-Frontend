import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Colors from '../constants/Colors'
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const AddOrdersSubSectionHeader = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Text style={styles.headerText}>{props.header}</Text>
     {!!props.subtitle && (<Text style={styles.subtitleText}>${props.subtitle}</Text>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent:'center',
    alignItems:'flex-start',
    padding: 5,
    // borderColor:Colors.lightBlue,
    // borderWidth: 1,
    // backgroundColor: Colors.lightBlue
  },
  headerText:{
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitleText:{
    fontSize: 14,
  }
});

export default AddOrdersSubSectionHeader;
