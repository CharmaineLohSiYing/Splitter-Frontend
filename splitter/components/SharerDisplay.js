import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

class SharerDisplay extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const newSelected = nextProps.selected;
    const oldSelected = this.props.selected;

    return newSelected !== oldSelected;
  }

  render() {
    const name = this.props.name;
    const selected = this.props.selected;

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(this.props.id)}
      >
        <Text>{name}</Text>
        {selected ? (
          <Ionicons name="ios-checkbox" size={24} color="black" />
        ) : (
          <Ionicons name="ios-square-outline" size={24} color="black" />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    marginVertical: 5,
    alignItems: "center",
    backgroundColor: Colors.lightBlue,
    padding: 10,
  },
});
export default SharerDisplay;
