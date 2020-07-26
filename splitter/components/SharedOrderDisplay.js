import React from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Colors from '../constants/Colors'

class SharedOrderDisplay extends React.Component {
  render() {
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
        onPress={() => this.props.edit(this.props.id, this.props.sharers)}
      >
        <Text>
          {sharersNames[0]} and {sharersNames.length - 1} other(s)
        </Text>
        <View style={styles.amountContainer}>
          <Text>${this.props.amount}</Text>
        </View>
        {/* <Button
          title="Delete"
          onPress={() => this.props.delete(this.props.id)}
        /> */}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:Colors.lightBlue,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    alignItems:'center',
    paddingHorizontal: 10
  },
  amountContainer:{
    backgroundColor:'white',
    borderWidth:2, 
    borderColor: '#ccc',
    minWidth: 80,
    alignItems:'center',
    height: 30,
    justifyContent:'center'
  }
});
const mapStateToProps = (state) => {
  const { attendees } = state.billEvent;
  return { attendees };
};

export default connect(mapStateToProps)(SharedOrderDisplay);
