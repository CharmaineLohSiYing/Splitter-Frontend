import React, { PureComponent, Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { connect } from "react-redux";

class OrderDisplay extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // const {
    //   contacts,
    //   amount,
    //   dispatch,
    //   id,
    //   name,
    //   onSelect,
    //   sharers,
    // } = nextProps;
    // const curr = this.props;

    // if (contacts !== curr.contacts) {
    //   console.log("contacts not equal!!!");
    // }
    // if (sharers !== curr.sharers) {
    //   console.log("contacts not equal!!!");
    // }

    // if (dispatch !== curr.dispatch) {
    //   console.log("dispatch not equal", dispatch, curr.dispatch);
    // }
    // if (id !== curr.id) {
    //   console.log("id not equal", id, curr.id);
    // }
    // if (name !== curr.name) {
    //   console.log("name not equal", name, curr.name);
    // }
    // // if (onSelect !== curr.onSelect) {
    // //   console.log("onSelect not equal", onSelect, curr.onSelect);
    // // }

    if (
      this.props.amount === nextProps.amount &&
      this.props.contacts === nextProps.contacts &&
      this.props.id === nextProps.id &&
      this.props.sharers === nextProps.sharers 
      // &&
      // this.props.onSelect === nextProps.onSelect
    ) {
      return false;
    } else {
      return true;
    }
  }

  componentDidUpdate() {
    // console.log("componentDidUpdate", this.props.amount);
  }

  componentDidMount() {
    // console.log("componentDidMOUNT", this.props.amount);
  }

  handleSelect = () => {
    if (this.props.sharers) {
      this.props.onSelect(this.props.id, this.props.sharers);
    } else {
      this.props.onSelect(this.props.id);
    }
  };

  render() {
    let firstSharerName = "";
    let sharers = [];
    if (this.props.sharers) {
      sharers = this.props.sharers;
      if (this.props.contacts) {
        const key = sharers[0];
        if (key in this.props.contacts) {
          firstSharerName = this.props.contacts[key].name;
        } else if (key === this.props.userId) {
          firstSharerName = "You";
        }
      }
    }

    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.8}
        onPress={this.handleSelect}
      >
        {!this.props.sharers && <Text>{this.props.name}</Text>}
        {!!this.props.sharers && (
          <Text>
            {firstSharerName} and {sharers.length - 1} other(s)
          </Text>
        )}
        <View style={styles.amountContainer}>
          <Text>${this.props.amount}</Text>
        </View>
        {/* <TouchableOpacity style={styles.amountContainer} onPress={() => this.props.onDelete(this.props.id)}>
          <Text>Delete</Text>
        </TouchableOpacity> */}
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
    marginVertical: 10,
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
const mapStateToProps = (state) => {
  const { contacts, userId } = state.auth;
  return { contacts, userId };
};

export default connect(mapStateToProps)(OrderDisplay);
