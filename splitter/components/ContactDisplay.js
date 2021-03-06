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
        activeOpacity={0.9}
        onPress={() => this.props.onSelect(name, mobileNumber)}
        style={{...styles.container, backgroundColor: selected ? Colors.blue4 : 'transparent'}}
      >
        <View style={styles.avatar}>
          <Ionicons name="md-person" size={18} color="white"/>
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.mobileNumber}>{mobileNumber}</Text>
        </View>
        {/* {selected && (
          <View style={styles.selected}>
            <Ionicons name="md-checkmark-circle" size={28} color="#007A74" />
          </View>
        )} */}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  name: {
    fontFamily: "roboto-bold",
    fontSize: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#D4DBED",
  },
  avatar:{
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor:'#ccc',
    alignItems:'center',
    justifyContent:'center',
    marginRight:10
  }
});

export default ContactDisplay;
