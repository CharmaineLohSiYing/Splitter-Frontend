import React, { PureComponent, Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { connect } from "react-redux";
import Avatar from "../components/Avatar";
import OverlappingAvatars from "../components/OverlappingAvatars";

import OrderAmount from "../components/UI/AmountButton";

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

  // componentDidUpdate() {
  //   console.log("componentDidUpdate", this.props.amount);
  // }

  // componentDidMount() {
  //   console.log("componentDidMOUNT", this.props.amount);
  // }

  handleSelect = () => {
    if (this.props.sharers) {
      this.props.onSelect(this.props.id, this.props.sharers);
    } else {
      this.props.onSelect(this.props.id);
    }
  };

  render() {
    let sharersLengthMinusOne = 0;
    let firstSharerName = "";
    let sharers = [];
    if (this.props.sharers) {
      sharers = this.props.sharers;
      sharersLengthMinusOne = sharers.length - 1;
      if (this.props.contacts) {
        const key = sharers[0];
        if (key in this.props.contacts) {
          firstSharerName = this.props.contacts[key].name;
        } else if (key === this.props.userId) {
          firstSharerName = "Me";
        }
      }
    }

    return (
      <TouchableOpacity
        style={{...styles.container, ...this.props.style}}
        activeOpacity={0.8}
        onPress={this.handleSelect}
      >
        <View style={styles.topRow}>
          {!this.props.sharers ? (
            <View style={styles.individualOrderContainer}>
              <Avatar />
              <Text style={{color: this.props.nameTextColor}}>{this.props.name}</Text>
            </View>
          ) : (
            <View>
              <OverlappingAvatars num={sharersLengthMinusOne + 1} />
            </View>
          )}

          <OrderAmount
            amount={this.props.amount}
            color={Colors.gray}
            backgroundColor="white"
          />
        </View>
        {this.props.sharers && (
          <View style={styles.bottomRow}>
            <Text style={styles.bottomRowText}>
              {sharersLengthMinusOne === 1
                ? firstSharerName + " and " + sharersLengthMinusOne + " other"
                : firstSharerName + " and " + sharersLengthMinusOne + " others"}
            </Text>
          </View>
        )}
        {/* <TouchableOpacity
          style={styles.amountContainer}
          onPress={() => this.props.onDelete(this.props.id)}
        >
          <Text>Delete</Text>
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent:'center',
    height: 70,
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: Colors.gray4,
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
  individualOrderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  topRow:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'100%'
  },
  bottomRow:{
    width:'100%',
  },
  bottomRowText:{
    fontSize: 12
  }
});
const mapStateToProps = (state) => {
  const { contacts, userId } = state.auth;
  return { contacts, userId };
};

export default connect(mapStateToProps)(OrderDisplay);
