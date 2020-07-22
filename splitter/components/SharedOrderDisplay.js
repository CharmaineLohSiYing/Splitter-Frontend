import React from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { connect } from "react-redux";

class SharedOrderDisplay extends React.Component {
  render() {
    console.log("shared order display");
    const sharers = this.props.sharers;

    let sharersNames = [];
    if (this.props.attendees) {
      sharers.forEach((key) => {
        if (key in this.props.attendees){
          sharersNames = sharersNames.concat(this.props.attendees[key].name);
        }
      });
    }

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <Text>
          {sharersNames[0]} and {sharersNames.length - 1} others
        </Text>
        <Text>${this.props.amount}</Text>
        <Button
          title="Edit"
          onPress={() => this.props.edit(this.props.id, this.props.sharers)}
        />
        <Button
          title="Delete"
          onPress={() => this.props.delete(this.props.id)}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
const mapStateToProps = (state) => {
  const { attendees } = state.billEvent;
  return { attendees };
};

export default connect(mapStateToProps)(SharedOrderDisplay);
