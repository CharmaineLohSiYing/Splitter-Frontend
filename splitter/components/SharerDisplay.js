import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      <View>
        <Text>{name}</Text>
        <TouchableOpacity onPress={() => this.props.onSelect(this.props.id)}>
          {selected ? (
            <Ionicons name="ios-checkbox" size={24} color="black" />
          ) : (
            <Ionicons name="ios-square-outline" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

export default SharerDisplay;
