import React, { PureComponent, Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from '../constants/Colors'
class ContactDisplay extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const newSelected = nextProps.selected;
    const oldSelected = this.props.selected;

    return newSelected !== oldSelected;
  }
  render() {
    const mobileNumber = this.props.mobileNumber;
    const name = this.props.name;
    const selected = this.props.selected;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(name, mobileNumber)}
        style={styles.container}
      >
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.mobileNumber}>{mobileNumber}</Text>
        </View>
        {selected && (
          <View style={styles.selected}>
            <Ionicons name="md-checkmark-circle" size={28} color="#007A74" />
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  name: {
    fontFamily: "roboto-bold",
    fontSize: 16,
  },
  mobileNumber: {},
  selected: {
    paddingHorizontal: 5
  },
  container: {
    flexDirection: "row",
    justifyContent:'space-between',
    alignItems: "center",
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: "#D4DBED",
  },
});

export default ContactDisplay;
