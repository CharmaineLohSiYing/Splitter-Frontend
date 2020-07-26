import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

class OrderDisplay extends React.Component {


  handleSelect = ()  => {
    if (this.props.sharers){
      this.props.edit(this.props.id, this.props.sharers)
    } else {
      this.props.onSelect(this.props.id)
    }
    
  }
  render() {
    let sharersNames = []
    if (this.props.sharers) {
      const sharers = this.props.sharers;
      if (this.props.attendees) {
        sharers.forEach((key) => {
          if (key in this.props.attendees) {
            sharersNames = sharersNames.concat(this.props.attendees[key].name);
          }
        });
      }
    }
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => {
          this.props.onSelect(this.props.id);
        }}
      >
        {!this.props.sharers && <Text>{this.props.name}</Text>}
        {!!this.props.sharers && (<Text>
          {sharersNames[0]} and {sharersNames.length - 1} other(s)
        </Text>)}
        <View style={styles.amountContainer}>
          <Text>${this.props.amount}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightBlue,
    // width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical:10.
  },
  amountContainer: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ccc",
    minWidth: 80,
    alignItems: "center",
    height: 30,
    justifyContent: "center",
  },
});
export default OrderDisplay;
