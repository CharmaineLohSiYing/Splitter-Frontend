import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Avatar from './Avatar'

class SharerDisplay extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const newSelected = nextProps.selected;
    const oldSelected = this.props.selected;

    return newSelected !== oldSelected;
  }

  render() {
    const {name,selected, first, last} = this.props

    return (
      <TouchableOpacity
        style={[styles.container, {borderTopWidth: first ? 1 : 0}, {borderBottomWidth : last ? 1 : 0}, {backgroundColor: selected ? Colors.blue3 : Colors.blue5}]}
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(this.props.id)}
      >
        <View style={styles.avatarContainer}>
          <Avatar/>
          <Text>{name}</Text>
        </View>
        
        {selected ? (
          <Ionicons name="md-radio-button-on" size={24} color={Colors.blue1} />
        ) : (
          <Ionicons name="md-radio-button-off" size={24} color={Colors.blue1} />
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
    alignItems: "center",
    padding: 10,
    borderLeftWidth: 1,
    borderRightWidth:1,
    borderColor: Colors.blue3
  },
  avatarContainer:{
    flexDirection:'row',
    alignItems:'center'
  }
});
export default SharerDisplay;
