import React from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableHighlightBase,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import CalculatorColumn from "../../../components/UI/CalculatorColumn";
import CalculatorButton from "../../../components/UI/CalculatorButton";
import * as billActions from "../../../store/actions/bill";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ProceedBottomButton from '../../../components/UI/ProceedBottomButton'
import Colors from '../../../constants/Colors'

class CalculatorScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      sharers: [],
      previousOperand: "",
      currentOperand: "0",
      operation: "",
      previousOperandDisplay: "",
      orderIdToUpdate: null,
      attendeeIdToUpdate: null,
      isLoading: false,
      combinedOrder: false,
      updatePaidAmount: false,
    };
  }


  pressDigitHandler = async (value) => {
    if (value === "Decimal" && this.state.currentOperand.includes(".")) {
      return;
    } else if (value === "Decimal") {
      value = ".";
    } else if (value === "0" && this.state.currentOperand === "") {
      return;
    } else if (this.state.currentOperand === "0" && value !== "Decimal") {
      await this.setState({
        currentOperand: value.toString(),
      });
      return;
    } else {
      await this.setState({
        currentOperand: this.state.currentOperand.toString() + value.toString(),
      });

      this.updateDisplay();
    }
  };

  pressEqualHandler = (value) => {
    this.compute();
    this.setState({ previousOperandDisplay: "" });
  };

  pressClearHandler = (value) => {
    this.setState({
      operation: "",
      previousOperandDisplay: "",
      currentOperand: "0",
      previousOperand: "",
    });
  };

  pressDeleteHandler = (value) => {
    const length = this.state.currentOperand.toString().length;
    if (length > 0) {
      if (length === 1) {
        this.pressClearHandler();
      } else {
        this.setState({
          currentOperand: this.state.currentOperand.toString().slice(0, -1),
        });
      }
    }
  };

  pressOperatorHandler = async (type) => {
    if (this.state.currentOperand === "") return;

    await this.compute();
    this.setState({
      operation: type,
      previousOperand: this.state.currentOperand,
      currentOperand: "",
    });
    this.updateDisplay();
  };

  getDisplayNumber = (number) => {
    return number;
  };

  updateDisplay = () => {
    this.setState({
      currentOperand: this.getDisplayNumber(this.state.currentOperand),
    });
    if (this.state.operation !== "") {
      let symbol;
      switch (this.state.operation) {
        case "Multiply":
          symbol = "*";
          break;
        case "Divide":
          symbol = "/";
          break;
        case "Add":
          symbol = "+";
          break;
        case "Subtract":
          symbol = "-";
          break;
        default:
          return;
      }
      this.setState({
        previousOperandDisplay:
          this.getDisplayNumber(this.state.previousOperand) + " " + symbol,
      });
    } else {
      //this.setState({previousOperandDisplay: this.getDisplayNumber(this.state.previousOperand)})
      this.setState({ previousOperandDisplay: "" });
    }
  };

  compute = async () => {
    let computation;
    const prev = parseFloat(this.state.previousOperand);
    const current = parseFloat(this.state.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.state.operation) {
      case "Multiply":
        computation = prev * current;
        break;
      case "Divide":
        computation = prev / current;
        break;
      case "Add":
        computation = prev + current;
        break;
      case "Subtract":
        computation = prev - current;
        break;
      case "Equal":
        computation = prev - current;
        break;
      default:
        return;
    }

    await this.setState({
      operation: "",
      currentOperand: computation,
      previousOperand: "",
    });
  };

  UNSAFE_componentWillMount() {
    const routeParams = this.props.route.params;
    let currentOrderAmount;
    let currentPaidAmount;
    if (routeParams) {
      if (routeParams.updateSharedOrder) {
        currentOrderAmount = this.props.sharedOrders.filter(
          (order) => order.id === routeParams.orderId
        )[0].amount;
        this.setState({
          currentOperand: currentOrderAmount.toString(),
          orderIdToUpdate: routeParams.orderId,
          sharers: routeParams.sharers,
        });
      } else if (routeParams.updateIndividualOrder) {

        currentOrderAmount = this.props.attendees[routeParams.userId].amount;
        this.setState({
          currentOperand: currentOrderAmount.toString(),
          attendeeIdToUpdate: routeParams.orderId,
          sharers: [this.props.attendees[routeParams.userId]],
        });
      } else if (routeParams.updatePaidAmount) {
        currentPaidAmount = this.props.attendees[routeParams.userId].paidAmount;
        var defaultValue = currentPaidAmount;
        if (currentPaidAmount == 0) {
          defaultValue = routeParams.unpaidAmount;
        }

        this.setState({
          currentOperand: defaultValue.toString(),
          attendeeIdToUpdate: routeParams.orderId,
          updatePaidAmount: true,
        });
      } else {
        // new shared order
        this.setState({
          combinedOrder: true,
          sharers: routeParams.sharers,
        });
      }
    }
  }

  submitOrder = async () => {
    // console.log('=====================submit===============')
    await this.compute();

    const {
      addSharedOrder,
      updateIndividualOrder,
      updateSharedOrder,
      updatePaidAmount,
    } = this.props.actions;

    if (this.state.updatePaidAmount) {
      updatePaidAmount(
        this.props.route.params.userId,
        this.state.currentOperand
      );

      this.props.navigation.navigate("AddPayers");
      return;
    } else {
      const sharersArray = this.state.sharers;

      if (sharersArray.length > 1) {
        if (this.state.orderIdToUpdate) {
          updateSharedOrder(
            this.state.orderIdToUpdate,
            this.state.currentOperand,
            sharersArray
          );
        } else {
          addSharedOrder(this.state.currentOperand, sharersArray);
        }
      } else {
        updateIndividualOrder(
          this.props.route.params.userId,
          this.state.currentOperand
        );
      }
      this.props.navigation.navigate("AddOrders");
    }
  };

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.aboveCalculator}>
          <View style={styles.calculatedValueContainer}>
            <Text style={styles.calculation}>
              {this.state.previousOperandDisplay}
            </Text>
          </View>
          <View style={styles.calculatedValueContainer}>
            <Text style={styles.calculation}>{this.state.currentOperand}</Text>
          </View>
          <View>
            <ProceedBottomButton proceedHandler={this.submitOrder}/>
          </View>
            
        </View>

        <View style={styles.calculator}>
          <CalculatorColumn>
            <CalculatorButton value="Clear" onPress={this.pressClearHandler} />
            <CalculatorButton
              grey
              digit
              value="7"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="4"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="1"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              value="Percent"
              onPress={this.pressOperatorHandler}
            />
          </CalculatorColumn>
          <CalculatorColumn>
            <CalculatorButton
              value="Divide"
              onPress={this.pressOperatorHandler}
            />
            <CalculatorButton
              grey
              digit
              value="8"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="5"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="2"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="0"
              onPress={this.pressDigitHandler}
            />
          </CalculatorColumn>
          <CalculatorColumn>
            <CalculatorButton
              value="Multiply"
              onPress={this.pressOperatorHandler}
            />
            <CalculatorButton
              grey
              digit
              value="9"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="6"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              digit
              value="3"
              onPress={this.pressDigitHandler}
            />
            <CalculatorButton
              grey
              value="Decimal"
              onPress={this.pressDigitHandler}
            />
          </CalculatorColumn>
          <CalculatorColumn>
            <CalculatorButton
              value="Delete"
              onPress={this.pressDeleteHandler}
            />
            <CalculatorButton
              value="Subtract"
              onPress={this.pressOperatorHandler}
            />
            <CalculatorButton value="Add" onPress={this.pressOperatorHandler} />
            <CalculatorButton
              style={{ flex: 2 }}
              value="Equal"
              onPress={this.pressEqualHandler}
            />
          </CalculatorColumn>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  calculator: {
    height: "60%",
    width: "100%",
    flexDirection: "row",
  },
  delete: {
    backgroundColor: Colors.lightBlue,
    height: "12%",
    width: "25%",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
  },
  calculatedValue: {
    fontSize: 30,
  },
  calculatedValueContainer: {
    alignItems: "flex-end",
  },
  calculation: {
    fontSize: 30,
  },
  aboveCalculator:{
    flex: 1,
    justifyContent:'flex-end'
  }
});

const mapStateToProps = (state) => {
  const { sharedOrders, attendees } = state.bill;
  return { sharedOrders, attendees };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(billActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorScreen);
